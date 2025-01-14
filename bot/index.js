// bot/index.js
const { Client, GatewayIntentBits, Events } = require("discord.js"); // Importación correcta

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
    if (message.content === 'hola') {
      message.channel.send('¡Hola! Soy NeopiaBot');
    }
});


// Log in to Discord with your client's token
client.login("MTMyODUyMTMxOTUxMTQ5MDcyMw.GrI9gT.CtCOYh9OZCAT0_n5kd2VbbTLTCK9AHxyeiK2U4");