import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { BRANDS } from "@/lib/data";

export const dynamic = "force-dynamic";

// Inicialización perezosa (lazy) del cliente para evitar crasheos si la API key falta en compilación
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La clave GEMINI_API_KEY no está configurada en los Secretos de la plataforma.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Generador de recomendaciones locales inteligente como mecanismo de seguridad (fallback) de alto nivel
function getFallbackRecommendation(username: string, age: number, answers: any) {
  const { budget, primaryUse, style, fuel, experience } = answers;

  // Recoger todos los coches posibles
  const allVehicles: any[] = [];
  BRANDS.forEach((brand) => {
    brand.vehicles.forEach((v) => {
      allVehicles.push({
        ...v,
        brandName: brand.name,
        brandAccent: brand.accentColor,
      });
    });
  });

  // Calcular puntuación de afinidad para cada vehículo
  const scoredVehicles = allVehicles.map((v) => {
    let score = 0;

    // 1. Coincidencia de Estilo / Categoría
    if (style && v.category.toLowerCase() === style.toLowerCase()) {
      score += 15;
    }

    // 2. Coincidencia de Motorización (Combustible)
    if (fuel && fuel !== "Cualquiera") {
      if (v.engineType.toLowerCase() === fuel.toLowerCase()) {
        score += 20;
      } else if (fuel.toLowerCase().includes("eléctrico") && v.engineType === "Eléctrico") {
        score += 20;
      } else if (fuel.toLowerCase().includes("híbrido") && v.engineType === "Híbrido") {
        score += 20;
      } else if (fuel.toLowerCase().includes("gasolina") && v.engineType === "Gasolina") {
        score += 20;
      }
    }

    // 3. Coincidencia de Presupuesto
    if (budget && budget !== "Indiferente") {
      const budgetNum = typeof budget === "string" ? parseInt(budget) : (budget as number);
      if (!isNaN(budgetNum)) {
        if (v.price <= budgetNum) {
          score += 15;
          // Bonificación extra si está cerca pero por debajo
          if (v.price >= budgetNum * 0.8) {
            score += 5;
          }
        } else {
          // Penalización proporcional si excede el presupuesto
          const diff = v.price - budgetNum;
          const pct = diff / budgetNum;
          if (pct < 0.1) {
            score += 5; // Excede sólo un poco
          } else if (pct > 0.4) {
            score -= 20; // Excede demasiado
          }
        }
      }
    }

    // 4. Adaptación para jóvenes primerizos
    const esPrimerizo = experience && experience.toLowerCase().includes("primer");
    if (esPrimerizo) {
      if (v.brandName === "Tesla") {
        score += 8; // Altamente autónomo, seguro y tecnológico
      } else if (v.category === "Compacto" || v.category === "SUV") {
        score += 6; // Fácil de maniobrar / visibilidad excelente / seguro
      } else if (v.brandName === "Porsche" && v.category === "Deportivo") {
        score -= 5; // Demasiada potencia para empezar
      }
    } else {
      // Conductor habitual / busca emoción agresiva
      if (v.category === "Deportivo") {
        score += 8;
      }
    }

    return { vehicle: v, score };
  });

  // Ordenar de mayor a menor puntuación
  scoredVehicles.sort((a, b) => b.score - a.score);

  // Tomar los 2 mejores coches
  const recommended = scoredVehicles.slice(0, 2).map((item) => {
    const v = item.vehicle;

    let razonPrincipal = `El ${v.brandName} ${v.name} es una elección inmejorable para ti. `;
    if (style) {
      razonPrincipal += `Al buscar un estilo ${style}, su diseño exterior se convertirá en una extensión de tu personalidad premium. `;
    }
    if (experience && experience.toLowerCase().includes("primer")) {
      razonPrincipal += `Su refinada asistencia electrónica, tracción impecable y tecnología avanzada de seguridad te aportarán la confianza absoluta que necesitas en tus primeros trayectos cotidianos.`;
    } else {
      razonPrincipal += `Sus impresionantes prestaciones y respuesta instantánea del acelerador (${v.specs.acceleration}) te garantizan un dinamismo insuperable en cada desplazamiento diario o escapada.`;
    }

    let destaqueDiseno = "";
    if (v.category === "Deportivo") {
      destaqueDiseno = "Silueta extremadamente baja, aerodinámica esculpida y puestos de mandos ergonómicos y digitales orientados al piloto purista que ansía notar las curvas.";
    } else if (v.category === "SUV") {
      destaqueDiseno = "Líneas fluidas y musculosas con una zaga estilizada tipo coupé. Combina presencia imponente en carretera con una óptima habitabilidad para tu ritmo de vida.";
    } else if (v.category === "Compacto") {
      destaqueDiseno = "Relación peso/potencia excepcional. Con un frontal imponente y una distribución equilibrada de peso que conjuga un look sumamente deportivo con agilidad urbana.";
    } else {
      destaqueDiseno = "Elegancia aerodinámica pulida al milímetro. Presenta trazos limpios, look futurista y elementos estéticos refinados de gama alta.";
    }

    let tipsPrimerizo = "";
    if (v.engineType === "Eléctrico") {
      tipsPrimerizo = "Para maximizar la experiencia, carga habitualmente en casa por la noche. En viajes largos, aprovecha la navegación inteligente integrada que programa las paradas express óptimas.";
    } else if (v.engineType === "Híbrido") {
      tipsPrimerizo = "Practica la frenada regenerativa para recargar la batería urbana automáticamente y lograr los consumos más reducidos del mercado.";
    } else {
      tipsPrimerizo = "Recuerda esperar unos segundos a que el motor lubrique adecuadamente al arrancar en frío antes de desplegar toda su espectacular potencia en carretera.";
    }

    return {
      marca: v.brandName,
      modelo: v.name,
      precioEstimado: `${v.price.toLocaleString("es-ES")} €`,
      razonPrincipal,
      destaqueDiseno,
      tipsPrimerizo,
    };
  });

  // Saludo personalizado con el tono apropiado
  let saludoPersonalizado = `¡Hola ${username || "Entusiasta"}! `;
  if (age && age >= 18) {
    saludoPersonalizado += `Hemos analizado exhaustivamente tu perfil para brindarte el vehículo definitivo a tus ${age} años, celebrando a lo grande tu libertad técnica.`;
  } else {
    saludoPersonalizado += "Hemos seleccionado las opciones que darán un vuelco espectacular a tu forma de moverte diaria.";
  }

  let analisisPerfil = `Tu preferencia por un coche de estilo ${style || "deportivo"}`;
  if (fuel && fuel !== "Cualquiera") {
    analisisPerfil += ` con motorización ${fuel}`;
  }
  if (budget && budget !== "Indiferente") {
    analisisPerfil += ` y un límite de inversión en torno a los ${budget} €`;
  }
  analisisPerfil += ", representa un perfil de conductor sofisticado que valora la potencia, el diseño y la tecnología avanzada en cada píxel.";

  return {
    saludoPersonalizado,
    analisisPerfil,
    modelosRecomendados: recommended,
    conclusionAsesor: `¡Ya has completado el cuestionario de amotor, ${username || "conductor"}! Estos exclusivos modelos encajan con precisión quirúrgica en tu cochera. En AMotor preparamos la entrega express a domicilio sin coste adicional, con trámites simplificados. ¡El coche de tus sueños te espera!`,
    isFallback: true,
  };
}

export async function POST(req: NextRequest) {
  let answersObj: any = null;
  let usernameStr = "Invitado";
  let ageNum = 18;

  try {
    const body = await req.json();
    const { answers, username, age } = body;
    answersObj = answers;
    usernameStr = username || "Invitado";
    ageNum = age || 18;

    if (!answersObj) {
      return NextResponse.json(
        { error: "Se requiere responder al cuestionario para recibir asistencia." },
        { status: 400 }
      );
    }

    const { budget, primaryUse, style, fuel, experience } = answersObj;

    const userPrompt = `
      Nombre del usuario: ${usernameStr}
      Edad: ${ageNum}
      Presupuesto: ${budget || "Indiferente"} €
      Uso principal del vehículo: ${primaryUse || "Uso diario y paseos"}
      Estilo preferido: ${style || "Deportivo / Compacto"}
      Combustible / Motorización: ${fuel || "Cualquiera"}
      Experiencia de conducción previa: ${experience || "Primer coche de mi vida"}
    `;

    const systemInstruction = `
      Eres un asesor automotriz de IA experto y carismático, integrado en la plataforma premium de compra a domicilio 'AMotor'.
      Tu misión es analizar el perfil del usuario (especialmente jóvenes adultos mayores de 18 años que buscan con alta emoción su primer vehículo) 
      y aconsejarle detalladamente sobre las mejores marcas, modelos y aspectos de diseño que se alineen con sus preferencias.

      Reglas críticas de diseño y tono:
      1. Comunícate enteramente en castellano (español de España), con un tono tecnológico, apasionado, moderno, pero a la vez profesional e informativo.
      2. Adáptate a la inexperiencia de compradores primerizos si se especifica que es su primer coche. Explica términos técnicos de forma sencilla pero impactante.
      3. Sugiere opciones reales del mercado, por ejemplo Porsche (718 Cayman, Taycan), Tesla (Model 3, Model Y), BMW (M2, i4), Audi (RS3, Q4 e-tron), Mercedes (CLA, Clase A AMG), u otras marcas relevantes para jóvenes.
      4. Justifica de manera atractiva por qué estos diseños, marcas y motorizaciones específicos encajan con el perfil introducido.
      5. La respuesta DEBE ser un JSON estrictamente estructurado según el esquema solicitado. No añadas introducciones ni formatos markdown fuera del JSON.
    `;

    const ai = getAiClient();
    
    // Tratamos de generar utilizando gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            saludoPersonalizado: {
              type: Type.STRING,
              description: "Un saludo cálido e individualizado llamando al usuario por su nombre, analizando con estilo su perfil de joven comprador.",
            },
            analisisPerfil: {
              type: Type.STRING,
              description: "Una pequeña síntesis técnica del perfil del usuario y su combinación de gustos.",
            },
            modelosRecomendados: {
              type: Type.ARRAY,
              description: "Lista de 2 a 3 vehículos recomendados con explicaciones detalladas.",
              items: {
                type: Type.OBJECT,
                properties: {
                  marca: { type: Type.STRING, description: "La marca del vehículo recomendado (e.g. Porsche, Tesla, BMW)." },
                  modelo: { type: Type.STRING, description: "El modelo recomendado idóneo para su perfil." },
                  precioEstimado: { type: Type.STRING, description: "Rango o precio orientativo." },
                  razonPrincipal: { type: Type.STRING, description: "Explicación técnica/emocional de por qué este vehículo encaja con sus necesidades diarias y estilo." },
                  destaqueDiseno: { type: Type.STRING, description: "Análisis sobre la estética exterior, las líneas de diseño, aerodinámica o look tecnológico de esta opción." },
                  tipsPrimerizo: { type: Type.STRING, description: "Un valioso consejo para un joven primerizo sobre el mantenimiento, carga eléctrica o disfrute seguro de este coche." },
                },
                required: ["marca", "modelo", "razonPrincipal", "destaqueDiseno"],
              },
            },
            conclusionAsesor: {
              type: Type.STRING,
              description: "Resumen motivador de cierre invitándoles a dar el paso en AMotor y disfrutar del envío gratuito directo a su domicilio.",
            },
          },
          required: ["saludoPersonalizado", "analisisPerfil", "modelosRecomendados", "conclusionAsesor"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("La IA no generó texto de respuesta.");
    }

    let cleanText = responseText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```[a-zA-Z]*\n?/, "");
      cleanText = cleanText.replace(/```$/, "");
      cleanText = cleanText.trim();
    }

    const data = JSON.parse(cleanText);
    return NextResponse.json({
      ...data,
      isFallback: false,
    });
  } catch (error: any) {
    console.warn("Llamada a Gemini fallida, activando recomendador inteligente local de salvaguarda:", error);
    
    // Si falla o no hay api key, generamos una recomendación local impecable y la devolvemos con isFallback: true
    try {
      const fallbackData = getFallbackRecommendation(usernameStr, ageNum, answersObj || {});
      return NextResponse.json(fallbackData);
    } catch (fallbackError: any) {
      console.error("Fallo crítico en recomendador local:", fallbackError);
      return NextResponse.json(
        {
          error: "No se pudo generar la recomendación por parte de nuestro asistente de Inteligencia Artificial.",
          details: error.message || error,
        },
        { status: 500 }
      );
    }
  }
}
