#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process')
const srcPath = path.join(__dirname, '..');
const targetPath = process.cwd()

const fileToCopy = ['.dockerfile', '.eslintrc.js', '.prettierrc', 'jest.config.js'];

function copyFiles() {
    fileToCopy.forEach(file => {
        fs.copyFileSync(`${srcPath}/${file}`,`${targetPath}/${file}`);
    });
}

function updatePackageJson(error, stdout, stderr) {
    
    try {
        const srcJson = require(`${srcPath}/package.json`);
        const targetJson = require(`${targetPath}/package.json`);

        if(!srcJson || !targetJson) {
            throw new Error('Can not find package.json')
        }

        const { 
            dependencies,
            main, 
            scripts, 
            devDependencies
        } = srcJson;

        const resultJson = Object.assign({}, targetJson, {dependencies, main, scripts, devDependencies}, {'lint-staged': srcJson['lint-staged']});
        fs.writeFileSync(`${targetPath}/package.json`, JSON.stringify(resultJson));
    } catch(e) {
        console.error(e);
    }
}

function writeGitIgnore() {
    fs.writeFileSync(`${targetPath}/.gitignore`, 'node_modules');
}

function npmInit(callBack) {
    if (fs.existsSync(`${targetPath}/package.json`)) {
        callBack();
        return;
    }    
    exec('npm init -y', callBack);
}

copyFiles();
writeGitIgnore();
npmInit(updatePackageJson)
exec(`cp -rv ${srcPath}/app ${targetPath}/app`);
exec(`cp -rv ${srcPath}/bin ${targetPath}/bin`);
exec(`cp -rv ${srcPath}/config ${targetPath}/config`);
exec(`cp -rv ${srcPath}/__test__ ${targetPath}/__test__`);
console.log('-----Project has been setted up-------')
console.log('Installing Package...')
exec('npm i');