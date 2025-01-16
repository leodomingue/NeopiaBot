// bot/index.js
const { Client, GatewayIntentBits, Events, MessageActivityType, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");

// Categorias e informacion de NEOPets que se fetcheara al inicio de la carga del bot para uso global.
// [searchCategories]: Categorias y tiendas de Objetos, con su id en items.jellyneo.net
// [searchSpecialCategories]: Categorias especiales, con su respectivo Id en items.jellyneo.net
const globalConst = {};

// Crear cliente de discord y permisos
const client = new Client({ 
  intents: [
      GatewayIntentBits.Guilds,          // Para eventos de servidor
      GatewayIntentBits.GuildMessages,  // Para escuchar mensajes en los canales
      GatewayIntentBits.MessageContent  // Para acceder al contenido de los mensajes
  ]
});

// Cuando el cliente esté listo, ejecuta este código (solo una vez).
client.once(Events.ClientReady, async readyClient => {
    
    console.log(`Estoy logeado como ${readyClient.user.tag}`);
    
    // MOVIDO A LA API
    
    // Fetcheamos las constantes necesarias sobre categorias y tipos de objetos en el juego.
    // De esta manera nuevas categorias se actualizaran automaticamente sin la necesidad de fetchearlas
    // cada vez que las necesitamos.
    // await axios.get("https://items.jellyneo.net/search")
    // .then(function (response) {
    //   const $ = cheerio.load(response.data);

    //   // Cargamos las categorias y tiendas de objetos, con su respectivo Id en jellyneo
    //   const $searchCategories = $("#search-category option");
    //   const searchCategories = new Map();
    //   for (const category of $searchCategories) {
    //     const $category = $(category);
    //     searchCategories.set($category.text(), $category.attr('value'));
    //   }
    //   globalConst["searchCategories"] = searchCategories;
    //   console.log("Cargada Categorias");

    //   // Cargamos las categorias especiales, con su respectivo Id en jellyneo
    //   const $searchSpecialCategories = $("#search-special-category option");
    //   const searchSpecialCategories = new Map();
    //   for (const category of $searchSpecialCategories) {
    //     const $category = $(category);
    //     searchSpecialCategories.set($category.text(), $category.attr('value'));
    //   }
    //   globalConst["searchSpecialCategories"] = searchSpecialCategories;
    //   console.log("Cargada Categorias Especiales");
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    console.log("Fin setup");
});


//Crear mensaje
client.on('messageCreate', (message) => {

  if(message.author.bot) return; //Si el mensaje es de un bot no lo lee
  if(!message.content.startsWith('!')) return; //Si el mensaje no comienza con ! no lo lee

  const args = message.content.slice(1).split(' '); //eliminamos el ! y divide la cadena
  const commandName = args.shift(); // Obtenemos el primer elemento de la cadena

  try{
    const command = require(`./commands/${commandName}.js`);
    command.run(message, args, globalConst)

  }catch(error){
    console.log(`Error al usar el codigo: ${args} `, error.message)
  }
});


client.login("MTMyODUyMTMxOTUxMTQ5MDcyMw.GrI9gT.CtCOYh9OZCAT0_n5kd2VbbTLTCK9AHxyeiK2U4");