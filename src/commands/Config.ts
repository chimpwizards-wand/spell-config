import Debug from 'debug';
import { Command } from  '@chimpwizards/wand'
import { Execute } from  '@chimpwizards/wand'
import { CommandDefinition, CommandParameter, CommandArgument } from '@chimpwizards/wand/commons/command/'
const chalk = require('chalk');
const debug = Debug("w:cli:config");

@CommandDefinition({ 
    alias: 'g',
    description: 'Change cli settings'
})
export class Config extends Command  { 

    execute(yargs: any): void {
        debug(`Do Nothing`)
        const executer = new Execute();
        let cmd = `w config --help`;
        executer.run({cmd: cmd, showLog: false})
    } 

}

export function register ():any {
    debug(`Registering....`)
    let command = new Config();
    debug(`INIT: ${JSON.stringify(Object.getOwnPropertyNames(command))}`)

    return command.build()
}

