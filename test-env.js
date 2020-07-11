let envs = [
    'Downloads',
    'Workspace',
    'GoogleDrive',
];

envs.forEach(env => {
    console.log(`${env}: \t${process.env[env]}`);
})