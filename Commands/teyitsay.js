const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const config = require('../config.json');
module.exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor("RANDOM").setFooter(config.footer).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setTimestamp();
    if(![config.kayıtYetkilisi].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komudu kullanmak için <@&" + config.kayıtYetkilisi + "> rolüne sahip olmalısın!")).then(x => x.delete({timeout: 10000}));
     let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) {
        let e = db.fetch(`yt.${message.author.id}.erkek`)
        let k = db.fetch(`yt.${message.author.id}.kadın`)
        let t = db.fetch(`yt.${message.author.id}.toplam`)
        if(e  === undefined || e  === null) e = "0"
        if(t  === undefined || t  === null) t = "0"
        if(k  === undefined || k  === null) k = "0"
        message.react("✅")
        message.channel.send(embed.setDescription(`\`•\` Toplam **__${t}__** net kaydınız bulunmakta.
        \`•\` Toplam **__${e}__** erkek kaydınız bulunmakta.
        \`•\` Toplam **__${k}__** kadın kaydınız bulunmakta.`)).then(x=> x.delete({timeout: 15000}));
    } else if(member) {
        let e = db.fetch(`yt.${member.id}.erkek`)
        let k = db.fetch(`yt.${member.id}.kadın`)
        let t = db.fetch(`yt.${member.id}.toplam`)
        if(e  === undefined || e  === null) e = "0"
        if(t  === undefined || t  === null) t = "0"
        if(k  === undefined || k  === null) k = "0"
        message.react("✅")
        message.channel.send(embed.setDescription(`\`•\` Toplam **__${t}__** net kaydı bulunmakta.
        \`•\` Toplam **__${e}__** erkek kaydı bulunmakta.
        \`•\` Toplam **__${k}__** kadın kaydı bulunmakta.`)).then(x=> x.delete({timeout: 15000}));
        
    }
    

};

exports.conf = {
    name: "kayıt-bilgi",
    aliases: ["kayıtbilgi", "kayıtsay", "kayıtlarım"]
}