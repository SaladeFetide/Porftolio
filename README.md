# 🖥️ LoukaOS 98 - Portfolio Rétro Windows 98

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Windows 98](https://img.shields.io/badge/Windows-98-008080?logo=windows&logoColor=white)](https://en.wikipedia.org/wiki/Windows_98)

> Un portfolio interactif nostalgique qui reproduit fidèlement l'expérience Windows 98 dans votre navigateur ! 💾

[🌐 Démo en direct](#) | [🐛 Signaler un bug](https://github.com/SaladeFetide/Porftolio_Windows/issues) | [✨ Demander une fonctionnalité](https://github.com/SaladeFetide/Porftolio_Windows/issues)

---

## 📸 Aperçu

![LoukaOS 98 Bureau](assets/images/Fond.jpg)

*Expérience authentique Windows 98 avec boot screen, bureau interactif, et applications nostalgiques*

---

## ✨ Fonctionnalités

### 🎨 Interface Authentique Windows 98
- **Boot Screen BIOS** - Séquence de démarrage réaliste avec Award BIOS
- **Bureau Windows 98** - Interface pixel-perfect avec barre des tâches, menu démarrer et horloge
- **Icônes déplaçables** - Drag & drop fonctionnel pour réorganiser votre bureau
- **Menu contextuel** - Clic droit sur le bureau pour accéder aux options
- **BSOD Easter Egg** - Blue Screen of Death classique (cliquez sur "NE PAS CLIQUER")

### 📁 Applications et Outils

#### 💼 Portfolio
- **Mes Projets** - Explorateur de projets avec descriptions détaillées
- **Compétences.exe** - Présentation interactive des compétences techniques
- **Mon CV.pdf** - Téléchargement du CV (FR/EN disponibles)
- **Contact** - Formulaire de contact avec copie d'email

#### 🎮 Jeux et Applications
- **DOOM 98** - Mini jeu de tir rétro first-person
- **Démineur** - Le classique jeu Minesweeper
- **Paint** - Outil de dessin avec crayon et gomme
- **Bloc-notes** - Éditeur de texte simple

#### 🔧 Utilitaires
- **MS-DOS Prompt** - Terminal interactif avec commandes (essayez `matrix`!)
- **Internet Explorer** - Navigateur avec liens GitHub et LinkedIn
- **Winamp** - Lecteur multimédia stylisé années 90
- **Explorateur de fichiers** - Navigation dans le système de fichiers C:
- **Calendrier** - Calendrier mensuel avec date du jour
- **Propriétés** - Changement de fond d'écran
- **Corbeille** - Gestion des fichiers supprimés

### 🌍 Support Multilingue
- **Français** 🇫🇷
- **Anglais** 🇬🇧
- Changement de langue dynamique via le menu démarrer

### 🎭 Easter Eggs
- 💡 **Clippy** - Assistant animé avec des conseils contextuels
- 💥 **BSOD** - Blue Screen of Death déclenchable
- 🎨 **Matrix Effect** - Tapez `matrix` dans le terminal
- 🖼️ **Fonds d'écran personnalisés** - Changez le thème visuel

---

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** - Structure sémantique et accessible
- **CSS3** - Styles pixel-perfect avec animations
- **JavaScript (Vanilla)** - Logique interactive sans frameworks

### Fonctionnalités Avancées
- **Canvas API** - Pour Paint et DOOM 98
- **LocalStorage** - Sauvegarde des préférences utilisateur
- **Responsive Design** - Adaptation mobile/tablette
- **Animations CSS** - Effets visuels fluides
- **Event Handlers** - Gestion d'événements complexe (drag & drop, clavier, souris)

### Assets
- **Win98Icons** - Collection d'icônes authentiques
- **Polices système** - MS Sans Serif, Fixedsys
- **Images** - Photos et illustrations personnalisées

---

## 🚀 Installation et Utilisation

### Installation Locale

```bash
# Cloner le repository
git clone https://github.com/SaladeFetide/Porftolio_Windows.git

# Accéder au dossier
cd Porftolio_Windows

# Ouvrir dans votre navigateur
# Option 1 : Double-cliquez sur index.html
# Option 2 : Utilisez un serveur local
python -m http.server 8000
# ou
npx serve
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

### Déploiement

Ce portfolio est 100% statique et peut être déployé sur :
- **GitHub Pages** (gratuit)
- **Netlify** (gratuit)
- **Vercel** (gratuit)
- **Tout hébergeur statique**

#### Exemple avec GitHub Pages

```bash
# 1. Activez GitHub Pages dans les paramètres du repository
# 2. Sélectionnez la branche main et le dossier racine
# 3. Votre site sera disponible sur https://votreusername.github.io/Porftolio_Windows
```

---

## 📂 Structure du Projet

```
Porftolio_Windows/
│
├── index.html              # Page principale
│
├── css/
│   └── style.css          # Styles Windows 98
│
├── js/
│   ├── script.js          # Logique principale
│   └── doom.js            # Moteur de jeu DOOM 98
│
├── assets/
│   ├── images/           # Images et icônes
│   │   ├── doom_*.png   # Assets DOOM
│   │   ├── Photo cv.png # Photo de profil
│   │   └── Fond.jpg     # Fond d'écran par défaut
│   │
│   └── docs/            # Documents téléchargeables
│       ├── CV_LOUKA_RIQUOIR.pdf
│       └── CV_EN.pdf
│
├── LICENSE              # Licence MIT
└── README.md           # Ce fichier
```

---

## 🎨 Personnalisation

### Modifier les Informations Personnelles

#### 1. Informations de Base
Éditez `js/script.js` pour modifier votre nom, localisation, etc. :

```javascript
// Recherchez la section "About" vers la ligne 150
const aboutContent = `
    <h2>Poste de [VOTRE NOM]</h2>
    <p>Étudiant BUT Informatique</p>
    ...
`;
```

#### 2. Ajouter des Projets
Dans `js/script.js`, section projets :

```javascript
const projects = [
    {
        name: "Nom du Projet",
        description: "Description courte",
        detailedDescription: "Description détaillée...",
        tech: ["HTML", "CSS", "JavaScript"],
        icon: "url-de-icone.png",
        link: "https://github.com/vous/projet"
    },
    // Ajoutez vos projets ici
];
```

#### 3. Modifier les Compétences
Cherchez la section `skills` et ajoutez/modifiez :

```javascript
const skills = [
    { name: "Java", level: 85 },
    { name: "Python", level: 70 },
    // Ajoutez vos compétences
];
```

#### 4. Changer les Couleurs du Thème
Dans `css/style.css` :

```css
:root {
    --win98-bg: #008080;        /* Couleur de fond bureau */
    --win98-titlebar: #000080;  /* Barre de titre */
    --win98-gray: #c0c0c0;      /* Gris Windows */
}
```

#### 5. Remplacer le CV
Remplacez les fichiers dans `assets/docs/` :
- `CV_LOUKA_RIQUOIR.pdf` → Votre CV français
- `CV_EN.pdf` → Votre CV anglais

#### 6. Changer la Photo de Profil
Remplacez `assets/images/Photo cv (png).png` avec votre photo.

### Ajouter une Nouvelle Application

1. **Créer l'icône sur le bureau** dans `index.html` :
```html
<div class="icon" style="top: 520px; left: 20px;" 
     ondblclick="openWindow('win-nouvelleapp')">
    <div class="icon-img" style="background-image: url('icone.png');"></div>
    <div class="icon-text">Nouvelle App</div>
</div>
```

2. **Créer la fenêtre** dans `index.html` :
```html
<div class="window" id="win-nouvelleapp" style="top: 100px; left: 100px;">
    <div class="title-bar">
        <span>Nouvelle Application</span>
        <button onclick="closeWindow('win-nouvelleapp')">×</button>
    </div>
    <div class="win-content">
        <!-- Contenu de votre application -->
    </div>
</div>
```

---

## 🌐 Compatibilité Navigateurs

| Navigateur | Support |
|-----------|---------|
| Chrome / Edge | ✅ Complet |
| Firefox | ✅ Complet |
| Safari | ✅ Complet |
| Opera | ✅ Complet |
| IE 11 | ⚠️ Partiel |

**Note:** Pour une meilleure expérience, utilisez un navigateur moderne.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. Créez votre **branche de fonctionnalité** (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Idées de Contributions
- 🎨 Nouveaux thèmes visuels (Windows XP, Windows 7, etc.)
- 🎮 Nouveaux jeux rétro (Solitaire, Space Invaders, etc.)
- 🌍 Traductions additionnelles (Espagnol, Allemand, etc.)
- 🐛 Corrections de bugs
- 📱 Amélioration du responsive mobile
- ♿ Accessibilité améliorée

---

## 📝 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2025 Louka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Remerciements et Crédits

- **Alex Meub** - [Win98Icons](https://win98icons.alexmeub.com/) - Collection d'icônes authentiques
- **Microsoft** - Inspiration Windows 98 UI/UX
- **Communauté Web Dev** - Tutoriels et ressources CSS/JS
- **Polices** - MS Sans Serif (système), Fixedsys (terminal)

### Inspirations
- Interface Windows 98 originale de Microsoft (1998)
- Design nostalgique années 90
- Communautés rétro-computing

---

## 📞 Contact

**Louka Riquoir**

- 💼 **Portfolio** : [LoukaOS 98](https://github.com/SaladeFetide/Porftolio_Windows)
- 📧 **Email** : [Voir dans l'application Contact]
- 🐙 **GitHub** : [@SaladeFetide](https://github.com/SaladeFetide)
- 💼 **LinkedIn** : [Voir dans Internet Explorer]

---

## 🎯 Statut du Projet

🟢 **Actif** - En développement continu

### Fonctionnalités à venir
- [ ] Mode sombre Windows 98
- [ ] Solitaire et autres jeux classiques
- [ ] Effets sonores Windows 98 authentiques
- [ ] Sauvegarde de la disposition du bureau
- [ ] Système de fichiers plus complet
- [ ] Réseau de neurones visualisé dans le terminal
- [ ] Easter eggs additionnels

---

## 📊 Statistiques

- **Lignes de code** : ~2000+ lignes
- **Taille** : < 1 MB (rapide à charger)
- **Applications** : 15+ applications fonctionnelles
- **Langues** : 2 (FR/EN)
- **Easter Eggs** : 5+ cachés dans l'interface

---

<div align="center">

### ⭐ N'oubliez pas de mettre une étoile si vous aimez ce projet !

**Fait avec ❤️ et beaucoup de nostalgie des années 90**

![Windows 98](https://img.shields.io/badge/Made%20with-Nostalgia-blue?style=for-the-badge&logo=windows&logoColor=white)

</div>

---

## 🔍 FAQ

<details>
<summary><strong>Comment puis-je utiliser ce portfolio pour moi-même ?</strong></summary>
<br>
Forkez le projet, modifiez les informations personnelles dans <code>js/script.js</code> et <code>index.html</code>, remplacez les CV et photos dans <code>assets/</code>, puis déployez !
</details>

<details>
<summary><strong>Le site est-il responsive ?</strong></summary>
<br>
Oui ! Le site s'adapte aux tablettes et mobiles, bien que l'expérience soit optimale sur desktop pour reproduire l'expérience Windows 98 authentique.
</details>

<details>
<summary><strong>Puis-je ajouter de vraies fonctionnalités de jeu ?</strong></summary>
<br>
Absolument ! Le Démineur et DOOM 98 sont déjà fonctionnels. Vous pouvez ajouter d'autres jeux en suivant le guide de personnalisation.
</details>

<details>
<summary><strong>Comment ajouter des effets sonores ?</strong></summary>
<br>
Vous pouvez ajouter des fichiers audio dans <code>assets/sounds/</code> et utiliser l'API Web Audio pour jouer les sons classiques de Windows 98 (startup, error, etc.).
</details>

<details>
<summary><strong>Le code est-il optimisé pour le SEO ?</strong></summary>
<br>
Le site utilise HTML sémantique et des balises meta appropriées. Pour améliorer le SEO, ajoutez des descriptions meta, Open Graph tags, et un fichier sitemap.xml.
</details>

---

<div align="center">

**© 2025 Louka Riquoir - Portfolio LoukaOS 98**

*"Windows 98 was ahead of its time... now it's back!"* 💾✨

</div>
