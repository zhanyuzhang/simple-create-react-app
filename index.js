#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');
const spawn = require('cross-spawn'); 
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const packageJson = require('./package.json');

let projectName; // 项目名称，通过命令行参数获取

const program = new commander.Command(packageJson.name)
.version(packageJson.version)
.arguments('<project-directory>')
.usage(`${chalk.green('<project-directory>')} [options]`)
.action(name => {
  projectName = name;
})
.parse(process.argv) // 格式化参数，必须要的

// 如果没有输入项目名称，则给出提示，并退出进程
if(typeof projectName === 'undefined') {
  console.error('please specify the project directory');
  console.log();
  console.log('For examaple: ')
  console.log(`    ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`)
  console.log();
  process.exit(1);
}

// 开始创建项目
createApp(projectName);

function createApp(name) {
  const root = path.resolve(name);
  fs.ensureDirSync(root); // 创建项目空目录
  console.log(`Creating a new React app in ${chalk.green(root)}.`);

  // 创建新项目的package.json
  const packageJson = {
    name: name,
    version: '0.1.0',
    private: true
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);

  // 将当前目录的路径存下来。因为下一步我们就要进入到新项目的目录了
  // 后面可能还会用到当前的路径
  const originalDirectory = process.cwd();

  // 进入新创建的项目里面
  process.chdir(root);

  run(root, originalDirectory);
}


function run(root, originalDirectory) {
  const allDependencies = ['react', 'react-dom', 'react-scripts'];
  console.log('Installing packages. This migth take a couple of minutes...');
  console.log(`Installing ${chalk.cyan('react')}, ${chalk.cyan('react-dom')}, and ${chalk.cyan('react-scripts')}...`);
  console.log();

  install(root, allDependencies)
  .then(() => {
    console.log();
    console.log('Installing is success!');
    console.log();

    // 执行react-scripts模块下的init方法进行初始化项目
    const scriptsPath = path.resolve(
      process.cwd(),
      'node_modules',
      'react-scripts',
      'scripts',
      'init.js'
    )
    const init  = require(scriptsPath);
    init(root, projectName, null, originalDirectory);
  })
  .catch(reason => {
    console.log();
    console.log('Aborting installation.');
    if(reason.command) {
      console.log(`    ${chalk.cyan(reason.command)} has failed.`);
    } else {
      console.log(chalk.red('Unexpected error!'), reason);
    }
  })
}

// 在指定目录下安装npm依赖
function install(root, dependencies) {
  return new Promise((resolve, reject) => {
    let command = 'yarnpkg';
    const args = ['add'];
    [].push.apply(args, dependencies);
    let child = spawn(command, args, {stido: 'inherit'});
    child.on('close', code => {
      if(code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    })
  });
}





