export interface Vehicle {
  id: string;
  brandId: string;
  name: string;
  price: number;
  engineType: "Eléctrico" | "Híbrido" | "Gasolina";
  specs: {
    acceleration: string; // e.g. "0-100 km/h en 3.3s"
    power: string; // e.g. "283 CV" or "450 CV"
    rangeOrConsumption: string; // e.g. "513 km" or "6.4 L/100km"
    deliveryTime: string; // e.g. "Envío gratis a tu puerta en 72h"
  };
  description: string;
  imageUrl: string;
  category: "SUV" | "Deportivo" | "Compacto" | "Berlina";
}

export interface Brand {
  id: string;
  name: string;
  slogan: string;
  origin: string;
  description: string;
  accentColor: string; // tailwind color class e.g. "from-red-600 to-red-800"
  textColor: string; // Hex color for canvas overlays
  logoUrl: string; // URL con foto real e icónica de la marca
  vehicles: Vehicle[];
}

export const BRANDS: Brand[] = [
  {
    id: "porsche",
    name: "Porsche",
    logoUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=120&h=120&q=80",
    slogan: "Ingeniería emocional para conductores puristas.",
    origin: "Alemania",
    description: "Símbolo inigualable de potencia y conducción de precisión. Fabricado para quienes buscan el máximo rendimiento deportivo directo en su casa.",
    accentColor: "from-amber-600 to-amber-800",
    textColor: "#d97706",
    vehicles: [
      {
        id: "porsche-cayman",
        brandId: "porsche",
        name: "718 Cayman S",
        price: 84600,
        engineType: "Gasolina",
        category: "Deportivo",
        specs: {
          acceleration: "4.4s",
          power: "350 CV",
          rangeOrConsumption: "9.2 L/100km",
          deliveryTime: "4 días directo a tu garaje"
        },
        description: "Motor central bóxer turboalimentado, diseñado para el joven entusiasta que ansía trazar curvas perfectas.",
        imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "porsche-taycan",
        brandId: "porsche",
        name: "Taycan 4S",
        price: 114200,
        engineType: "Eléctrico",
        category: "Deportivo",
        specs: {
          acceleration: "4.0s",
          power: "530 CV",
          rangeOrConsumption: "512 km autonomía",
          deliveryTime: "Entrega a domicilio en 5 días"
        },
        description: "El deportivo del mañana disponible hoy. Conducción enteramente eléctrica con el ADN inconfundible de Stuttgart.",
        imageUrl: "https://images.unsplash.com/photo-1611245041308-840a23501a35?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "tesla",
    name: "Tesla",
    logoUrl: "https://images.unsplash.com/photo-1620803135860-49ef4de43dbb?auto=format&fit=crop&w=120&h=120&q=80",
    slogan: "Acelerando la transición al transporte sostenible.",
    origin: "EE.UU.",
    description: "Referente mundial en software sobre ruedas, autonomía sobresaliente y recarga ultra rápida para el conductor hiperconectado.",
    accentColor: "from-red-600 to-red-800",
    textColor: "#dc2626",
    vehicles: [
      {
        id: "tesla-m3",
        brandId: "tesla",
        name: "Model 3 Performance",
        price: 55490,
        engineType: "Eléctrico",
        category: "Berlina",
        specs: {
          acceleration: "3.1s",
          power: "460 CV",
          rangeOrConsumption: "528 km autonomía",
          deliveryTime: "Listo para entrega en 48 horas"
        },
        description: "Aceleración de superdeportivo con tracción total Dual Motor, piloto automático e interior minimalista futurista.",
        imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "tesla-my",
        brandId: "tesla",
        name: "Model Y LR",
        price: 49990,
        engineType: "Eléctrico",
        category: "SUV",
        specs: {
          acceleration: "5.0s",
          power: "340 CV",
          rangeOrConsumption: "533 km autonomía",
          deliveryTime: "Entrega a domicilio express (72 horas)"
        },
        description: "El SUV idóneo de la nueva generación: versatilidad de almacenamiento masivo y máxima seguridad incorporada.",
        imageUrl: "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "bmw",
    name: "BMW",
    logoUrl: "https://images.unsplash.com/photo-1617814040924-fba6f73db2f8?auto=format&fit=crop&w=120&h=120&q=80",
    slogan: "El auténtico placer de conducir en tu puerta.",
    origin: "Alemania",
    description: "Estilo dinámico y refinamiento interior premium combinado con sistemas de tren motriz legendarios.",
    accentColor: "from-blue-600 to-blue-800",
    textColor: "#2563eb",
    vehicles: [
      {
        id: "bmw-m2",
        brandId: "bmw",
        name: "M2 Coupé",
        price: 79900,
        engineType: "Gasolina",
        category: "Deportivo",
        specs: {
          acceleration: "4.1s",
          power: "460 CV",
          rangeOrConsumption: "9.7 L/100km",
          deliveryTime: "Envío express en 3 días"
        },
        description: "Tracción trasera legendaria para un manejo sumamente juguetón y deportivo. Ideal para el fin de semana.",
        imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "bmw-i4",
        brandId: "bmw",
        name: "i4 eDrive40 M Sport",
        price: 61900,
        engineType: "Eléctrico",
        category: "Berlina",
        specs: {
          acceleration: "5.7s",
          power: "340 CV",
          rangeOrConsumption: "589 km autonomía",
          deliveryTime: "Entrega a domicilio certificada en 5 días"
        },
        description: "Gran Coupé sofisticado y dinámico. Silencioso en carretera pero con la rigidez y empuje deportivo de la marca bávara.",
        imageUrl: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "audi",
    name: "Audi",
    logoUrl: "https://images.unsplash.com/photo-1610552050890-fe99536c2615?auto=format&fit=crop&w=120&h=120&q=80",
    slogan: "A la vanguardia de la técnica y la tecnología.",
    origin: "Alemania",
    description: "Tracción Quattro mítica, interiores digitales impecables de primer nivel y comodidad absoluta para todos tus trayectos.",
    accentColor: "from-zinc-700 to-zinc-900",
    textColor: "#3f3f46",
    vehicles: [
      {
        id: "audi-rs3",
        brandId: "audi",
        name: "RS 3 Sportback",
        price: 78900,
        engineType: "Gasolina",
        category: "Compacto",
        specs: {
          acceleration: "3.8s",
          power: "400 CV",
          rangeOrConsumption: "9.0 L/100km",
          deliveryTime: "Entregado a domicilio en 72 horas"
        },
        description: "La joya de cinco cilindros con el sonido de motor más glorioso y el control quattro de curvas definitivo.",
        imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "audi-q4",
        brandId: "audi",
        name: "Q4 e-tron Sportback",
        price: 58700,
        engineType: "Eléctrico",
        category: "SUV",
        specs: {
          acceleration: "6.2s",
          power: "286 CV",
          rangeOrConsumption: "520 km autonomía",
          deliveryTime: "Envío directo a casa en 4 días"
        },
        description: "Líneas de coupé deportivo en un SUV eléctrico versátil, de bajo consumo y equipamiento acústico premium.",
        imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    logoUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=120&h=120&q=80",
    slogan: "The Best or Nothing.",
    origin: "Alemania",
    description: "El pináculo del lujo europeo adaptado a la revolución tecnológica, con sistemas multimedia inteligentes táctiles e hiper-realistas AI.",
    accentColor: "from-sky-700 to-sky-950",
    textColor: "#0369a1",
    vehicles: [
      {
        id: "mb-cla",
        brandId: "mercedes",
        name: "CLA 250 e Coupé",
        price: 53500,
        engineType: "Híbrido",
        category: "Berlina",
        specs: {
          acceleration: "6.8s",
          power: "218 CV",
          rangeOrConsumption: "1.2 L/100km (Híbrido)",
          deliveryTime: "Listo para entrega en 72 horas"
        },
        description: "Coupé híbrido enchufable de 4 puertas. Conducción urbana puramente eléctrica y de alta elegancia nocturna.",
        imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "mb-a45",
        brandId: "mercedes",
        name: "AMG A 45 S 4MATIC+",
        price: 81300,
        engineType: "Gasolina",
        category: "Compacto",
        specs: {
          acceleration: "3.9s",
          power: "421 CV",
          rangeOrConsumption: "9.1 L/100km",
          deliveryTime: "Entrega a domicilio protegida en 4 días"
        },
        description: "El motor de 4 cilindros de producción en serie más potente del mundo. Un misil compacto repleto de telemetría y lujo.",
        imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "ford",
    name: "Ford",
    logoUrl: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&w=120&h=120&q=80",
    slogan: "Nacidos libres, listos para cualquier aventura.",
    origin: "EE.UU.",
    description: "Durabilidad icónica extrema y potencia americana diseñada para el joven de espíritu aventurero.",
    accentColor: "from-emerald-700 to-emerald-950",
    textColor: "#047857",
    vehicles: [
      {
        id: "ford-bronco",
        brandId: "ford",
        name: "Bronco Outer Banks",
        price: 86900,
        engineType: "Gasolina",
        category: "SUV",
        specs: {
          acceleration: "6.9s",
          power: "335 CV",
          rangeOrConsumption: "10.8 L/100km",
          deliveryTime: "Te lo llevamos a cualquier rincón en 6 días"
        },
        description: "Capacidades todoterreno legendarias, puertas desmontables y un diseño neo-retro de un impacto visual absoluto.",
        imageUrl: "https://images.unsplash.com/photo-1623079400394-f07936d5a5e1?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "ford-mustang-gt",
        brandId: "ford",
        name: "Mustang GT Fastback",
        price: 57500,
        engineType: "Gasolina",
        category: "Deportivo",
        specs: {
          acceleration: "4.3s",
          power: "450 CV",
          rangeOrConsumption: "12.2 L/100km",
          deliveryTime: "Listo para entrega en 72 horas"
        },
        description: "El icónico muscle car americano en su máxima expresión. Potencia Coyote V8 atmosférico con un rugido inconfundible, tracción trasera y una silueta coupé emocionante.",
        imageUrl: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "ford-mache",
        brandId: "ford",
        name: "Mustang Mach-E GT",
        price: 76200,
        engineType: "Eléctrico",
        category: "SUV",
        specs: {
          acceleration: "3.7s",
          power: "487 CV",
          rangeOrConsumption: "490 km autonomía",
          deliveryTime: "Envío prioritario a tu domicilio en 48h"
        },
        description: "La fusión más audaz de las prestaciones Mustang con la versatilidad de un SUV totalmente eléctrico.",
        imageUrl: "https://images.unsplash.com/photo-1627454820516-dc76bf7e319a?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];
