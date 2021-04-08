const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const config = require('../config.json');
module.exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor("RANDOM").setFooter(config.footer).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setTimestamp();
    if(![config.kayıtYetkilisi].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komudu kullanmak için <@&" + config.kayıtYetkilisi + "> rolüne sahip olmalısın!")).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let isim = args[1].charAt(1).replace("i", "İ").toUpperCase() + args[1].slice(1).toUpperCase();
    let yaş = Number(args[2]);
    let name = `${member.user.username.includes(config.tag) ? config.tag : config.unTag} ${isim} | ${yaş}`;
    if(!member || !yaş || !isim) return message.channel.send(embed.setDescription(`Tüm argümanları doğru kullanın!\n\`.k {user} {isim} {yaş}\``)).then(x => x.delete({timeout: 10000}));
    if(!member.id === message.author.id || !member.id === message.guild.OwnerID || client.user.bot || member.roles.highest.position >= message.member.roles.highest.position) return ;

        if(!member.roles.cache.has(config.vipRolü) && !member.roles.cache.has(config.boosterRolü) && !member.user.username.includes(config.tag)) return message.channel.send(embed.setDescription(`Sunucumuz tagsız alıma kapalıdır. Lütfen üyelerin tag almasını sağlayın!`));
 
    if(member.user.username.includes(config.tag)) {
        member.roles.add(config.tagRolü)
        member.roles.add(congif.kadınRolleri)
        member.roles.remove(config.kayıtsızRolleri)
        member.setNickname(`${name}`)
    } else {
        member.roles.add(congif.kadınRolleri)
        member.roles.remove(config.kayıtsızRolleri)
        member.setNickname(`${name}`)
    };
    
    db.add(`yt.${message.author.id}.toplam`, +1);
    db.add(`yt.${message.author.id}.kadın`, +1);
    db.add(`isimler.${member.id}.toplam`, +1);
    db.push(`isimler.${member.id}`,{
        Name: name,
        Role: `<@&${config.kadın}>`
    });
    
    message.react(config.yes)
    let data = db.fetch(`isimler.${member.id}`)
    if(!data) {
        message.channel.send(embed.setDescription(`
${member} kişisi başarıyla <@&${config.kadın}> olarak kayıt edildi.

${config.no} Kişinin isim kaydı bulunamadı!`)).then(x => x.delete({timeout: 10000}));
    } else if(data) {
        let top = db.fetch(`isimler.${member.id}.toplam`)
        let isimler = data.map(x => `\`• ${x.Name}\` (${x.Role})`).reverse().splice(0, 10)
        message.channel.send(embed.setDescription(`
${member} kişisi başarıyla <@&${config.kadın}> olarak kayıt edildi.

${config.no} Kişinin toplamda **${top}** isim kaydı bulundu

${isimler.join("\n")}`))
    };

    

};

exports.conf = {
    name: "kadın",
    aliases: ["kadın", "k"]
}