const fs = require('fs');

const path = require('path');

const moment = require('moment-timezone');



async function setTemplateMenu(qasim, type, m, prefix, setv, db, options = {}) {

    const day = moment.tz('Asia/Karachi').locale('en').format('dddd');

    const date = moment.tz('Asia/Karachi').locale('en').format('DD/MM/YYYY');

    const time = moment.tz('Asia/Karachi').locale('en').format('HH:mm:ss');

    const greeting = time < '05:00:00' ? 'Good Early Morning 🌉' 

        : time < '11:00:00' ? 'Good Morning 🌄' 

        : time < '15:00:00' ? 'Good Afternoon 🏙' 

        : time < '18:00:00' ? 'Good Evening 🌅' 

        : time < '19:00:00' ? 'Good Evening 🌃' 

        : time < '23:59:00' ? 'Good Night 🌌' 

        : 'Good Night 🌌';



    // Prepare top menu text with at least 5 commands

    let total = Object.entries(db.hit || {})

        .sort((a, b) => b[1] - a[1])

        .filter(([command]) => command !== 'totalcmd' && command !== 'todaycmd')

        .slice(0, 5);



    let text = `╭──❍「 *TOP MENU* 」❍\n`;



    if (total && total.length >= 5) {

        total.forEach(([command, hit]) => {

            text += `│${setv} ${prefix}${command}: ${hit} hits\n`;

        });

        text += '╰──────❍';

    } else {

        text += `│${setv} ${prefix}allmenu\n`;

        text += `│${setv} ${prefix}ownermenu\n`;

        text += `│${setv} ${prefix}botmenu\n`;

        text += `│${setv} ${prefix}toolsmenu\n`;

        text += `│${setv} ${prefix}groupmenu\n`;

        text += '╰──────❍';

    }



    // Compose detailed user and bot info text

    const menuText = `

╭──❍「 *USER INFO* 」❍

├ *Name* : ${m.pushName ? m.pushName : 'No Name'}

├ *User* : ${options.isVip ? 'VIP' : options.isPremium ? 'PREMIUM' : 'FREE'}

├ *Limit* : ${options.isVip ? 'VIP' : (db.users[m.sender]?.limit ?? 0)}

├ *Money* : ${db.users[m.sender] ? db.users[m.sender].money.toLocaleString('en-US') : '0'}

╰─┬────❍

╭─┴─❍「 *BOT INFO* 」❍

├ *Bot Name* : ${global.botname || 'Bot'}

├ *Owner* : @${(global.owner && global.owner[0]) ? global.owner[0].split('@')[0] : 'owner'}

├ *Mode* : ${qasim.public ? 'Public' : 'Self'}

├ *Prefix* : ${db.set && db.set[options.botNumber]?.multiprefix ? '「 MULTI-PREFIX 」' : ' *' + prefix + '*'}

╰─┬────❍

╭─┴─❍「 *ABOUT* 」❍

├ *Date* : ${date}

├ *Day* : ${day}

├ *Time* : ${time} WIB

╰──────❍\n`;



    // Compose full caption: greeting + menu + user/bot info + footer note

    const caption = `${text}\n${menuText}\n*${greeting}*\n\nPlease use ${prefix}allmenu\nTo see all the menus`;



    // Image path (adjust filename if needed)

    const imagePath = path.join(__dirname, '..', 'src', 'media', 'global.png');



    // Check if image exists

    if (!fs.existsSync(imagePath)) {

        return m.reply('Menu image not found, please check the path.');

    }



    // Send image with caption, mention user, quoted original message

    await qasim.sendMessage(m.chat, {

        image: fs.readFileSync(imagePath),

        caption: caption,

        mentions: [m.sender]

    }, { quoted: m });

}



module.exports = setTemplateMenu;

let file = require.resolve(__filename);

fs.watchFile(file, () => {

    fs.unwatchFile(file);

    console.log(chalk.redBright(`Update ${__filename}`));

    delete require.cache[file];

    require(file);

});
