// bot/index.js
const { Client, GatewayIntentBits, Events, MessageActivityType, EmbedBuilder } = require("discord.js");

// Crear cliente de discord y permisos
const client = new Client({ 
  intents: [
      GatewayIntentBits.Guilds,          // Para eventos de servidor
      GatewayIntentBits.GuildMessages,  // Para escuchar mensajes en los canales
      GatewayIntentBits.MessageContent  // Para acceder al contenido de los mensajes
      
  ]
});

// Cuando el cliente esté listo, ejecuta este código (solo una vez).
client.once(Events.ClientReady, readyClient => {
    console.log(`Estoy logeado como ${readyClient.user.tag}`);
});


//Crear mensaje
client.on('messageCreate', (message) => {

  if(message.author.bot) return; //Si el mensaje es de un bot no lo lee
  if(!message.content.startsWith('!')) return; //Si el mensaje no comienza con ! no lo lee

  const args = message.content.slice(1).split(' '); //eliminamos el ! y divide la cadena
  const commandName = args.shift(); // Obtenemos el primer elemento de la cadena

  try{
    const command = require(`./commands/${commandName}.js`);
    command.run(message, args)

  }catch(error){
    console.log(`Error al usar el codigo: ${args} `, error.message)
  }
});


client.login("MTMyODUyMTMxOTUxMTQ5MDcyMw.GrI9gT.CtCOYh9OZCAT0_n5kd2VbbTLTCK9AHxyeiK2U4");