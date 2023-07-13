# atch
!!! not secure, todo :  must block user to go up workspace and do what they want on system

## run 
`node .`

## dev
`npm run dev`

watch change in _workspace directory

if not exist, you must create

_workspace and _trash folders

Une ressource possède deux identifiants : 
- File1, File2, Folder1, tRucMachin.jeveux ... : c'est un identifiant "d'enveloppe" utile pour les humains, c'est le nom de fichier ou de dossier comme ion a l'habitude de l'utiliser. Il peut être changé, il peut être multiple , en de multiples emplacements, plusieurs ressources peuvent avoir le même nom.
- @id : identifiant JSONld de contenu, permet de relier les ressources, les unes avec les autres, de relier les contenus entre eux. il est non modifiable et unique


### inspiré de vatch 
 -voir scenaristeur/vatch et picture at root

# dependencies
- socket.io : https://socket.io/get-started/chat
- watcher : https://github.com/fabiospampinato/watcher

# net available 
`npm install -g localtunnel
lt --port 3000
`
-> your url is: https://warm-things-lick.loca.lt

get your ip https://ipv4.icanhazip.com/ and submit

# local
- mint parefeu https://forums.linuxmint.com/viewtopic.php?t=152242

```
sudo ufw status verbose
sudo ufw default deny incoming
sudo ufw app list
sudo ufw allow 3000

```
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04