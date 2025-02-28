import { supabase } from "../supabase"

async function seeders() {
  try {
    const { data } = await supabase.from('dishes').select()
    if (!data || (data.length && data.length < 10)) {
      const ids: string[] | undefined = data?.map(data => data?.id)
      if (ids) {
        await supabase.from('dishes').delete().in('id', ids)
      }
      const { data: { user } } = await supabase.auth.getUser()
      const {error} = await supabase.from('dishes').insert([
        {
          title: "Gaspacho rafraîchissant",
          description: "Originaire d'Andalousie, le gaspacho est une soupe froide à base de tomates, concombres, poivrons et ail, mixés avec de l'huile d'olive et du vinaigre. Parfait pour les journées chaudes, il est servi bien frais et garni de légumes croquants et de feuilles de mâche pour une touche de verdure.",
          image_url: "https://www.cuisinedespagne.fr/cdn/shop/articles/le-gazpacho-origine-et-histoire-663301.webp?v=1693636782",
          ingredients: ["4 tomates mûres​", "1 concombre​", "1 poivron rouge​", "1 gousse d'ail​", "2 cuillères à soupe d'huile d'olive​", "1 cuillère à soupe de vinaigre de vin rouge​", "Sel et poivre au goût​", "Radis, dés de concombre et feuilles de mâche pour la garniture"],
          instructions: [
            "Émondez les tomates en les plongeant dans de l'eau bouillante pendant 30 secondes, puis retirez la peau.",
            "Épépinez le concombre et le poivron, puis coupez-les en morceaux.",
            "Dans un mixeur, combinez les tomates, le concombre, le poivron et l'ail. Mixez jusqu'à l'obtention d'une texture lisse.",
            "Ajoutez l'huile d'olive, le vinaigre, le sel et le poivre. Mixez de nouveau pour bien incorporer les assaisonnements.",
            "Versez le mélange dans un récipient, couvrez et réfrigérez pendant au moins 2 heures pour permettre aux saveurs de se mélanger.",
            "Avant de servir, mélangez à nouveau et ajustez l'assaisonnement si nécessaire.",
            "Servez le gaspacho dans des bols ou des verres, garni de rondelles de radis, de dés de concombre et de feuilles de mâche. Ajoutez un tour de moulin à poivre pour rehausser les saveurs."
          ],
          cooking_time: 15,
          number_persons: 4,
          difficulty: 1,
          
          user_id: user?.id
        },
        {
          title: "Pad thaï au poulet",
          description: "Plat emblématique de la cuisine thaïlandaise, le pad thaï est un sauté de nouilles de riz mélangées à des morceaux de poulet marinés, des légumes croquants et des œufs. Le tout est assaisonné d'une sauce sucrée-salée à base de tamarin, puis garni d'arachides concassées et de coriandre fraîche pour une explosion de saveurs et de textures.",
          image_url: "https://www.readyseteat.ca/sites/g/files/qyyrlu541/files/uploadedImages/VH_Chicken-Pad-Thai.jpg",
          ingredients: [
            "200 g de nouilles de riz",
            "200 g de poitrine de poulet, coupée en lamelles",
            "2 cuillères à soupe d'huile d'arachide",
            "3 gousses d'ail, hachées",
            "2 œufs, battus",
            "100 g de germes de soja",
            "50 g de cacahuètes non salées, concassées",
            "4 oignons verts, émincés",
            "1 carotte, râpée",
            "2 cuillères à soupe de sauce soja",
            "2 cuillères à soupe de sauce de poisson",
            "1 cuillère à soupe de sucre de palme",
            "1 cuillère à soupe de jus de citron vert",
            "1 pincée de piment en poudre (facultatif)"
          ],
          instructions: [
            "Faites tremper les nouilles de riz dans de l'eau chaude pendant environ 10 minutes jusqu'à ce qu'elles soient tendres. Égouttez et réservez.",
            "Dans un bol, mélangez le poulet avec 1 cuillère à soupe de sauce de poisson et laissez mariner pendant 5 minutes.",
            "Dans un wok ou une grande poêle, chauffez l'huile d'arachide à feu moyen-élevé. Ajoutez l'ail haché et faites-le revenir jusqu'à ce qu'il soit parfumé.",
            "Ajoutez le poulet mariné et faites-le sauter jusqu'à ce qu'il soit bien cuit.",
            "Poussez le poulet sur le côté du wok et versez les œufs battus. Remuez jusqu'à ce qu'ils soient cuits, puis mélangez-les avec le poulet.",
            "Ajoutez les nouilles de riz égouttées, la carotte râpée et les germes de soja. Mélangez bien.",
            "Dans un petit bol, combinez la sauce soja, la sauce de poisson restante, le sucre de palme, le jus de citron vert et le piment en poudre. Versez cette sauce sur les nouilles et mélangez pour bien enrober tous les ingrédients.",
            "Ajoutez les oignons verts émincés et mélangez une dernière fois.",
            "Servez le pad thaï chaud, garni de cacahuètes concassées et de quartiers de citron vert."
          ],
          cooking_time: 30,
          number_persons: 4,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Aïoli mayonnaise",
          description: "L'aïoli est une sauce provençale onctueuse à base d'ail et d'huile d'olive, similaire à une mayonnaise. Traditionnellement servie avec des légumes cuits à la vapeur, des fruits de mer ou du poisson, elle apporte une saveur intense et parfumée qui rehausse de nombreux plats méditerranéens.",
          image_url: "https://nouvellesgastronomiques.com/wp-content/uploads/2019/07/aioli.jpg",
          ingredients: ["1 jaune d'oeuf", "1 cuillière à café de moutarde de Dijon", "2 gousses d'ail, écrasées"],
          instructions: [
            "Dans un bol, mélangez un jaune d'œuf avec de la moutarde.",
            "Incorporez progressivement l'huile en fouettant constamment.",
            "Ajoutez l'ail écrasé et le jus de citron.",
            "Assaisonnez avec du sel et du poivre.",
            "Servez avec des légumes cuits à la vapeur."
          ],
          cooking_time: 10,
          number_persons: 6,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Lasagnes végétariennes",
          description: "Une alternative savoureuse aux lasagnes classiques, cette version végétarienne alterne des couches de pâtes avec une sauce tomate riche, de la ricotta crémeuse et des légumes sautés tels que les épinards et les champignons. Le tout est gratiné au four avec du fromage râpé jusqu'à obtenir une croûte dorée et appétissante.",
          image_url: "https://cdn.shopify.com/s/files/1/0028/7083/7313/articles/homemade-vegetarian-veggie-lasagna-2022-01-27-22-57-42-utc.jpg?v=1670963612",
          ingredients: [
            "12 feuilles de lasagnes",
            "500 g de tomates fraîches",
            "2 oignons",
            "5 Ingrédients 15 Minutes",
            "2 gousses d'ail",
            "200 g de champignons de Paris",
            "200 g d'épinards frais",
            "250 g de ricotta",
            "100 g de fromage râpé (mozzarella ou emmental)",
            "2 cuillères à soupe d'huile d'olive",
            "Sel et poivre au goût",
            "Une pincée de sucre (pour réduire l'acidité des tomates)"
          ],
          instructions: [
            "Préparation de la sauce tomate : Émincez les oignons et l'ail. Faites-les revenir dans une casserole avec une cuillère à soupe d'huile d'olive jusqu'à ce qu'ils soient translucides. Ajoutez les tomates coupées en dés, assaisonnez de sel, de poivre et d'une pincée de sucre. Laissez mijoter pendant 20 minutes jusqu'à épaississement.",
            "Préparation des légumes : Dans une poêle, faites chauffer une cuillère à soupe d'huile d'olive. Ajoutez les champignons tranchés et faites-les sauter jusqu'à évaporation de leur eau. Ajoutez les épinards et faites-les cuire jusqu'à ce qu'ils soient flétris. Assaisonnez selon votre goût.",
            "Assemblage des lasagnes : Préchauffez le four à 180°C. Dans un plat à gratin, étalez une fine couche de sauce tomate. Disposez une couche de feuilles de lasagnes, puis une couche de ricotta, une couche de légumes sautés, et une couche de sauce tomate. Répétez les couches en terminant par une couche de sauce tomate. Saupoudrez de fromage râpé sur le dessus.",
            "Cuisson : Couvrez le plat avec du papier aluminium et enfournez pendant 20 minutes. Retirez le papier aluminium et poursuivez la cuisson pendant 20 minutes supplémentaires jusqu'à ce que le dessus soit doré et bouillonnant.",
            "Repos : Laissez reposer les lasagnes pendant 10 minutes avant de les servir pour faciliter la découpe et permettre aux saveurs de se mélanger."
          ],
          cooking_time: 40,
          number_persons: 4,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Tacos de poisson",
          description: "Inspirés de la cuisine mexicaine, ces tacos se composent de filets de poisson délicatement frits, servis dans des tortillas de maïs chaudes. Ils sont accompagnés de tranches de citron vert, de salsa fraîche et de feuilles de coriandre, offrant un mélange harmonieux de saveurs acidulées et épicées.",
          image_url: "https://brandsitesplatform-res.cloudinary.com/image/fetch/w_1540,c_scale,q_auto:eco,f_auto,fl_lossy,dpr_1.0,e_sharpen:85/https://assets.brandplatform.generalmills.com%2F-%2Fmedia%2Fproject%2Fgmi%2Foldelpaso%2Foldelpaso-ca%2Frecipes%2Fdate-night-spicy-fish-tacos.jpg%3Fw%3D800%26rev%3Dd733410d59074859a736bd2c2ec40a8e%201540w",
          ingredients: [
            "500 g de filets de poisson blanc (cabillaud, tilapia, etc.)",
            "8 tortillas de maïs ou de blé",
            "1 cuillère à café de paprika",
            "1 cuillère à café de cumin moulu",
            "Sel et poivre au goût",
            "2 cuillères à soupe d'huile d'olive",
            "Le jus d'un citron",
            "1 avocat mûr",
            "1 petite tomate",
            "1/2 oignon rouge",
            "Quelques feuilles de coriandre fraîche",
            "1/4 de chou rouge",
            "1 yaourt nature",
            "1 cuillère à soupe de mayonnaise",
            "1 gousse d'ail émincée",
            "1 cuillère à soupe de jus de citron supplémentaire"
          ],
          instructions: [
            "Préparation du poisson : Dans un bol, mélangez le paprika, le cumin, le sel, le poivre, l'huile d'olive et le jus de citron. Enduisez les filets de poisson de cette marinade et laissez reposer pendant 15 minutes.",
            "Préparation de la sauce crémeuse : Dans un autre bol, mélangez le yaourt, la mayonnaise, l'ail émincé, le jus de citron supplémentaire, du sel et du poivre. Réservez au frais.",
            "Préparation des garnitures : Émincez finement le chou rouge. Coupez l'avocat, la tomate et l'oignon rouge en petits dés. Mélangez-les avec quelques feuilles de coriandre pour préparer une salsa fraîche.",
            "Cuisson du poisson : Faites chauffer une poêle à feu moyen et faites cuire les filets de poisson pendant 3 à 4 minutes de chaque côté jusqu'à ce qu'ils soient dorés et cuits à cœur. Une fois cuits, émiettez-les légèrement à la fourchette."
          ],
          cooking_time: 20,
          number_persons: 4,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Risotto aux champignons",
          description: "Classique de la cuisine italienne, le risotto aux champignons est un plat crémeux où le riz Arborio est cuit lentement dans un bouillon parfumé, absorbant progressivement les saveurs. En fin de cuisson, des champignons sautés, du parmesan râpé et une noix de beurre sont ajoutés pour enrichir le goût et la texture.",
          image_url: "https://cdn.pratico-pratiques.com/app/uploads/sites/3/2021/05/26151521/risotto-aux-champignons-et-asperges.jpg",
          ingredients:  [
            "200 g de riz Arborio",
            "300 g de champignons de Paris, émincés",
            "1 oignon, haché finement",
            "1 gousse d'ail, émincée",
            "1 litre de bouillon de légumes chaud",
            "50 g de parmesan râpé",
            "2 cuillères à soupe de beurre",
            "2 cuillères à soupe d'huile d'olive",
            "Sel et poivre au goût"
          ],
          instructions: [
            "Dans une grande poêle, chauffez l'huile d'olive et faites revenir l'oignon et l'ail jusqu'à ce qu'ils soient translucides.",
            "Ajoutez les champignons et faites-les sauter jusqu'à ce qu'ils soient dorés.",
            "Incorporez le riz Arborio et remuez pendant 2 minutes pour le nacrer.",
            "Versez une louche de bouillon chaud et remuez jusqu'à absorption complète.",
            "Répétez l'opération, une louche à la fois, en attendant l'absorption du bouillon avant d'ajouter la suivante, jusqu'à ce que le riz soit cuit al dente (environ 18-20 minutes).",
            "Retirez du feu, ajoutez le beurre et le parmesan râpé.",
            "Mélangez bien, assaisonnez avec du sel et du poivre, puis servez chaud."
          ],
          cooking_time: 10,
          number_persons: 2,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Salade niçoise",
          description: "Originaire de Nice, cette salade colorée combine des haricots verts croquants, des tomates cerises juteuses, des olives noires savoureuses et des filets de thon. Le tout est assaisonné d'une vinaigrette légère et servi sur un lit de laitue fraîche, offrant un repas équilibré et rafraîchissant.",
          image_url: "https://www.fromager.net/wp-content/uploads/2023/11/recette-salade-nicoise.jpg",
          ingredients: [
            "200 g de haricots verts, cuits al dente",
            "2 tomates, coupées en quartiers",
            "1 concombre, tranché",
            "1 oignon rouge, émincé",
            "1 poivron rouge, coupé en dés",
            "1 boîte de thon au naturel (environ 200 g), égoutté",
            "2 œufs durs, coupés en quartiers",
            "10 olives noires",
            "1 cuillère à soupe de câpres",
            "1 cuillère à soupe de moutarde de Dijon",
            "3 cuillères à soupe d'huile d'olive",
            "1 cuillère à soupe de vinaigre de vin rouge",
            "Sel et poivre au goût"
          ],
          instructions: [
            "Dans un grand saladier, combinez les haricots verts, les tomates, le concombre, l'oignon, le poivron, le thon, les œufs, les olives et les câpres.",
            "Dans un petit bol, préparez la vinaigrette en fouettant la moutarde, l'huile d'olive, le vinaigre, le sel et le poivre.",
            "Versez la vinaigrette sur la salade et mélangez délicatement pour enrober tous les ingrédients.",
            "Servez immédiatement, accompagné de pain frais si désiré."
          ],
          cooking_time: 20,
          number_persons: 2,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Quiche lorraine",
          description: "Spécialité de la région Lorraine en France, la quiche lorraine est une tarte salée composée d'une pâte croustillante garnie d'un mélange d'œufs battus, de crème fraîche et de lardons. Après cuisson, elle présente une texture fondante et une saveur riche, idéale pour un repas convivial.",
          image_url: "https://media.foodspring.com/magazine/public/uploads/2020/11/protein_quiche_rezept-1195x460.jpg",
          ingredients: [
            "1 pâte brisée",
            "3 œufs",
            "200 ml de crème fraîche épaisse",
            "100 g de lardons fumés",
            "100 g de fromage râpé (gruyère ou emmental)",
            "1 cuillère à soupe de beurre",
            "Sel et poivre au goût"
          ],
          instructions: [
            "Préchauffez le four à 180°C (thermostat 6).",
            "Faites revenir les lardons dans une poêle sans matière grasse jusqu'à ce qu'ils soient dorés. Égouttez-les sur du papier absorbant.",
            "Dans un saladier, battez les œufs avec la crème fraîche. Ajoutez le fromage râpé, les lardons, le sel et le poivre. Mélangez bien.",
            "Étalez la pâte brisée dans un moule à tarte beurré. Piquez le fond avec une fourchette.",
            "Versez le mélange aux œufs sur la pâte.",
            "Enfournez pendant 35 à 40 minutes, jusqu'à ce que la quiche soit dorée et que la garniture soit prise.",
            "Laissez tiédir avant de servir, chaude ou froide."
          ],
          cooking_time: 15,
          number_persons: 2,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Bouillabaisse provençale",
          description: "Plat traditionnel de la Provence, la bouillabaisse est une soupe de poissons et de fruits de mer cuits dans un bouillon aromatisé aux épices et aux herbes méditerranéennes. Elle est généralement servie avec des croûtons de pain grillé et une sauce rouille, offrant une expérience culinaire authentique et réconfortante.",
          image_url: "https://www.cuisineactuelle.fr/imgre/fit/~1~cac~2018~09~25~6b87832c-6681-4d35-b764-efd48a63844d.jpeg/555x312/quality/80/crop-from/center/bouillabaisse-provencale.jpeg",
          ingredients: [
            "1,5 kg de poissons variés (rascasse, grondin, congre)",
            "500 g de fruits de mer (moules, crevettes)",
            "4 tomates mûres",
            "2 oignons",
            "2 poireaux",
            "1 bulbe de fenouil",
            "4 gousses d'ail",
            "1 branche de céleri",
            "1 bouquet garni (thym, laurier, persil)",
            "1 pincée de safran",
            "1 zeste d'orange",
            "20 cl d'huile d'olive",
            "Sel et poivre",
            "Croûtons de pain grillé",
            "Sauce rouille"
          ],
          instructions: [
            "Préparation des ingrédients : Nettoyez et ébarbez les poissons et les fruits de mer. Coupez les poissons en morceaux. Émincez les oignons, les poireaux, le fenouil et le céleri. Pelez et concassez les tomates. Hachez l'ail.",
            "Cuisson du bouillon : Dans une grande marmite, faites chauffer l'huile d'olive. Ajoutez les oignons, les poireaux, le fenouil, le céleri et l'ail, puis faites revenir pendant 5 minutes. Incorporez les tomates concassées, le bouquet garni, le safran, le zeste d'orange, le sel et le poivre. Versez 2 litres d'eau et portez à ébullition. Laissez mijoter pendant 30 minutes.",
            "Ajout des poissons : Ajoutez les morceaux de poissons les plus fermes dans le bouillon et laissez cuire pendant 10 minutes. Puis, incorporez les poissons plus délicats et les fruits de mer, et poursuivez la cuisson pendant 5 à 7 minutes supplémentaires, jusqu'à ce que tous les ingrédients soient cuits.",
            "Service : Retirez le bouquet garni et le zeste d'orange. Servez la bouillabaisse bien chaude, accompagnée de croûtons de pain grillé et de sauce rouille."
          ],
          cooking_time: 30,
          number_persons: 6,
          difficulty: 1,
          user_id: user?.id
        },
        {
          title: "Tarte aux framboises",
          description: "Dessert classique et élégant, la tarte aux framboises se compose d'une pâte croustillante garnie de framboises fraîches et juteuses. Légèrement sucrée, elle met en valeur la saveur acidulée des framboises, offrant une conclusion parfaite à un repas.",
          image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJs080v4iOW2udqZnn8eDzduvgAnpMp1xEQ&s",
          ingredients: [
            "1 pâte sablée",
            "500 g de framboises fraîches",
            "100 g de sucre en poudre",
            "2 œufs",
            "20 cl de crème fraîche",
            "1 sachet de sucre vanillé",
            "2 cuillères à soupe de poudre d'amandes"
          ],
          instructions: [
            "Préparation de la pâte : Préchauffez le four à 180°C (th.6). Étalez la pâte sablée dans un moule à tarte beurré et piquez le fond avec une fourchette. Saupoudrez la poudre d'amandes sur le fond de tarte pour absorber le jus des fruits pendant la cuisson.",
            "Préparation de la garniture : Dans un saladier, battez les œufs avec le sucre en poudre et le sucre vanillé jusqu'à ce que le mélange blanchisse. Ajoutez la crème fraîche et mélangez bien.",
            "Assemblage : Disposez les framboises sur le fond de tarte en une seule couche, puis versez la préparation à base d'œufs et de crème par-dessus, en veillant à bien répartir le mélange.",
            "Cuisson : Enfournez la tarte pendant 30 minutes, jusqu'à ce que la garniture soit prise et que la pâte soit dorée. Laissez refroidir avant de déguster."
          ],
          cooking_time: 20,
          number_persons: 6,
          difficulty: 1,
          user_id: user?.id
        }   
      ])
  
      if (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }
}


export default seeders;