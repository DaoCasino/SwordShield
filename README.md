World of warcraft on Ethereum :slightly_smiling_face:


The presentation http://slides.com/huanderalexander/sward-shield#/5
Forontend demo: https://swordshield-94d17.firebaseapp.com/
Youtube demo: https://youtu.be/kUHB9vx11Cg

Completely decentralized and fast game. Attack enemies or defend yourself. Runs in the background

0. step one. gamer select skin. (0- minatavr, 1 - lizard, 2 - druid). after registration anybody can attack you.
1. bot.js of attacker send a transaction "battle(skin,seed,enemy address)" to the blockchain and whisper.
3. bot.js of attacked use signidice algorithm for generate the result
4. Upload result to the blockchain 

features:
very fast random - signidice + whisper

problems with status.im
1) we cannot start whisper in bot.js and browser.
2) web3 in browser does not working (say "undefined provider")
3) so we just publish source codes, your programmers may check logic. Verified contract:
