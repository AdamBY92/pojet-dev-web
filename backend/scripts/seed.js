const sequelize = require('../config/database');
const { User, Event, Category, Registration } = require('../models');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    console.log('🌱 Début du seed de la base de données...');
    
    // Réinitialiser la base de données
    await sequelize.sync({ force: true });
    console.log('✅ Base de données réinitialisée');

    // Hasher les mots de passe
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    // Créer les utilisateurs
    const admin = await User.create({
      email: 'admin@app.com',
      password: adminPassword,
      role: 'admin'
    });

    const user1 = await User.create({
      email: 'user@app.com',
      password: userPassword,
      role: 'user'
    });

    const user2 = await User.create({
      email: 'jean@app.com',
      password: userPassword,
      role: 'user'
    });

    console.log('✅ Utilisateurs créés');

    // Créer les catégories
    const categories = await Promise.all([
      Category.create({
        name: 'Technologie',
        description: 'Événements liés à la technologie',
        color: '#3498db'
      }),
      Category.create({
        name: 'Développement Web',
        description: 'Conférences et ateliers sur le développement web',
        color: '#e74c3c'
      }),
      Category.create({
        name: 'Business',
        description: 'Événements d\'affaires et réseautage',
        color: '#f39c12'
      }),
      Category.create({
        name: 'Design',
        description: 'Événements de design et UX/UI',
        color: '#9b59b6'
      }),
      Category.create({
        name: 'Données & IA',
        description: 'Machine Learning et Data Science',
        color: '#1abc9c'
      })
    ]);

    console.log('✅ Catégories créées');

    // Créer les événements
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const events = await Promise.all([
      Event.create({
        title: 'Introduction à React',
        description: 'Découvrez les bases de React et créez votre première application interactive.',
        date: tomorrow,
        location: 'Salle A - Campus ESILV',
        maxParticipants: 30,
        currentParticipants: 5,
        status: 'scheduled',
        isPublic: true,
        createdBy: admin.id,
        categoryId: categories[1].id
      }),
      Event.create({
        title: 'Node.js Advanced',
        description: 'Approfondissez vos connaissances en Node.js avec des patterns avancés.',
        date: nextWeek,
        location: 'Salle B - Campus ESILV',
        maxParticipants: 20,
        currentParticipants: 8,
        status: 'scheduled',
        isPublic: true,
        createdBy: admin.id,
        categoryId: categories[1].id
      }),
      Event.create({
        title: 'Atelier Design UX/UI',
        description: 'Apprenez les principes du design moderne et de l\'expérience utilisateur.',
        date: nextMonth,
        location: 'Salle C - Campus ESILV',
        maxParticipants: 15,
        currentParticipants: 3,
        status: 'scheduled',
        isPublic: true,
        createdBy: admin.id,
        categoryId: categories[3].id
      }),
      Event.create({
        title: 'Machine Learning 101',
        description: 'Les fondamentaux du Machine Learning et de la science des données.',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        location: 'Amphithéâtre - Campus ESILV',
        maxParticipants: 50,
        currentParticipants: 12,
        status: 'scheduled',
        isPublic: true,
        createdBy: admin.id,
        categoryId: categories[4].id
      }),
      Event.create({
        title: 'Networking Tech Leaders',
        description: 'Événement privé de réseautage avec les leaders technologiques.',
        date: nextMonth,
        location: 'Restaurant - Paris',
        maxParticipants: 25,
        currentParticipants: 2,
        status: 'scheduled',
        isPublic: false,
        createdBy: admin.id,
        categoryId: categories[2].id
      }),
      Event.create({
        title: 'Hackathon 2024',
        description: '24 heures de coding intensif. Formez une équipe et innovez!',
        date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        location: 'Grand Hall - Campus ESILV',
        maxParticipants: 100,
        currentParticipants: 45,
        status: 'scheduled',
        isPublic: true,
        createdBy: admin.id,
        categoryId: categories[0].id
      })
    ]);

    console.log('✅ Événements créés');

    // Créer des inscriptions
    await Registration.create({
      userId: user1.id,
      eventId: events[0].id
    });

    await Registration.create({
      userId: user1.id,
      eventId: events[2].id
    });

    await Registration.create({
      userId: user2.id,
      eventId: events[0].id
    });

    console.log('✅ Inscriptions créées');

    console.log('\n✨ Base de données alimentée avec succès!\n');
    console.log('🔐 Comptes de test créés:');
    console.log('   Admin:');
    console.log('     Email: admin@app.com');
    console.log('     Mot de passe: Admin123!');
    console.log('   Utilisateur:');
    console.log('     Email: user@app.com');
    console.log('     Mot de passe: User123!');
    console.log('     Email: jean@app.com');
    console.log('     Mot de passe: User123!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seed();