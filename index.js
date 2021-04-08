const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');
require('moment-duration-format');
const config = require('./config.json');
const ms = require('ms');
const { waitForDebugger } = require('inspector');
const path = require('path');
const { Client, Util } = require('discord.js');
require('./util/eventLoader.js')(client);
const express = require('express');
var Jimp = require('jimp');
const db = require('quick.db');
const { WebhookClient } = require('discord.js');
const log = message => {console.log(`${message}`);};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Commands/', (err, files) => {
if (err) console.error(err);
log(`Toplam ${files.length} Adet Komut Yükleniyor...`);
files.forEach(f => {
let props = require(`./Commands/${f}`);
log(`BOT | ${props.conf.name} Komutu Yüklendi.`);
client.commands.set(props.conf.name, props);
props.conf.aliases.forEach(alias => {client.aliases.set(alias, props.conf.name);});});});

client.reload = command => {return new Promise((resolve, reject) => {try {delete require.cache[require.resolve(`./Commands/${command}`)];
let cmd = require(`./Commands/${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {if (cmd === command) client.aliases.delete(alias);});
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {client.aliases.set(alias, cmd.help.name);});resolve();} catch (e) {reject(e);}});};

client.load = command => {return new Promise((resolve, reject) => {try {let cmd = require(`./Commands/${command}`);
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {client.aliases.set(alias, cmd.help.name);});resolve();} catch (e) {reject(e);}});};

client.unload = command => { return new Promise((resolve, reject) => { try {delete require.cache[require.resolve(`./Commands/${command}`)];
let cmd = require(`./Commands/${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {if (cmd === command) client.aliases.delete(alias);});resolve();} catch (e) {reject(e);}});};
client.login(config.token);
client.elevation = message => {
if (!message.guild) {return;}
let permlvl = 0;
if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
if (message.author.id === config.sahip) permlvl = 4; return permlvl;};
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));});
client.on('error', e => {console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));});


client.on("ready", async () => {
client.user.setPresence({ activity: {name: "Patavatsız ❤️ Haise"}, status: "idle" });
const vc = client.channels.cache.get(config.botVoiceChannel);
vc.join();
});



client.on('message', async function(message){
  let prefix = "!";
  if(!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  var cmd = client.commands.get(args.shift()) 
  if(cmd) cmd.run(client, message, args);
})



client.on('message', async(message) => {
if(!message.guild || message.author.bot || message.content.startsWith(client.prefix)) return;
db.add(`messageData.${message.author.id}.channel.${message.channel.id}`, 1);
db.push(`messageData.${message.author.id}.times`, {time: Date.now(), puan: 1})
})



client.tarihHesapla = (date) => {
    const startedAt = Date.parse(date);
    var msecs = Math.abs(new Date() - startedAt);
  
    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
    msecs -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
    msecs -= months * 1000 * 60 * 60 * 24 * 30;
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
    msecs -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(msecs / (1000 * 60 * 60));
    msecs -= hours * 1000 * 60 * 60;
    const mins = Math.floor((msecs / (1000 * 60)));
    msecs -= mins * 1000 * 60;
    const secs = Math.floor(msecs / 1000);
    msecs -= secs * 1000;
  
    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`
    else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
    else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
    else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
    else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
    else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
    else if (secs > 0) string += `${secs} saniye`
    else string += `saniyeler`;
  
    string = string.trim();
    return `${string} önce`;
  };

client.wait = async function(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  
  Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  };
  
  Array.prototype.temizle = function() {
   let yeni = [];
    for (let i of this) {
     if (!yeni.includes(i)) yeni.push(i);
    }
    return yeni;
  };

client.on("guildMemberAdd", async(member) => {
    member.roles.add(config.kayıtsızRolü)
    member.setNickname(`${config.tag} İsim | Yaş`)
    let count = member.guild.members.cache.size.toString();
    if(Date.now() - member.user.createdTimestamp >= 1000 * 60 * 60 * 24 * 15) {
    client.channels.cache.get(config.welcomeChannel).send(`
\`>\` Sunucumuza hoşgeldin ${member}!

    \`>\` Hesabın \`${client.tarihHesapla(member.user.createdAt)}\` oluşturulmuş!
    
    \`>\` Sunucu kurallarımız <#${config.Rules}> kanalında belirtilmiştir, sunucuya kayıt olduğunuzda kuralları okumuş sayılırsınız!
    
\`>\` Seninle birlikte ${count} kişiye ulaştık! Tagımızı (${config.tag}) alarak sunucuya kayıt olabilirsiniz! Seninle kayıt yetkililerimiz ilgilenecektir! İyi eğlenceler :tada::tada::tada:`)

    } else if(Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 15) {
        member.roles.add(config.Suspicious)
        client.channels.cache.get(config.welcomeChannel).send(new Discord.MessageEmbed().setColor("BLACK").setFooter(config.footer).setDescription(`
        ${member} adlı kullanıcı sunucuya katıldı fakat hesabı 15 günden önce açıldığı için şüpheliye atıldı!`))
    } else if (member.user.bot) {
        member.roles.add(config.botRolü)
        client.channels.cache.get(config.welcomeChannel).send(new Discord.MessageEmbed().setColor("RANDOM").setFooter(config.footer).setDescription(`
        Sunucumuza bir bot katıldı ve bot rolü verildi! (${member})`));
    }
})

client.on("message", async(message) => {
    if(message.content.toLowerCase() === "tag" || message.content.toLowerCase() === ".tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === "?tag") return message.channel.send(config.tag);
});

client.on("guildMemberRemove", async(member) => {
db.push(`isimler.${member.id}`, {
    Name: member.displayName,
    Role: "Sunucudan Ayrılma"
})
});
