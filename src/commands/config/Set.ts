import Debug from 'debug';
import { Command } from  '@chimpwizards/wand'
import { CommandDefinition, CommandParameter, CommandArgument } from '@chimpwizards/wand/commons/command/'
const chalk = require('chalk');
const debug = Debug("w:cli:config:set");
import { Config } from  '@chimpwizards/wand'
import * as _ from 'lodash';  

@CommandDefinition({ 
    description: 'Set configuration property to a specific value',
    parent: 'config'
})
export class Set extends Command  { 

    @CommandArgument({ description: 'Setting to update', required: true})
    name: string = '';

    @CommandArgument({ description: 'New value to assign', required: true})
    value: string = '';

    execute(yargs: any): void {
        debug(`UPDATE ${this.name} = ${this.value}`)
        var configInstance = new Config();
        var currentConfig = configInstance.load();
        var settings : any= { settings: {}}
        settings.settings[this.name] = this.value
        var newConfig = _.merge({}, currentConfig, settings);
        configInstance.save({context: newConfig})
    }
}

export function register ():any {
    debug(`Registering....`)
    let command = new Set();
    debug(`INIT: ${JSON.stringify(Object.getOwnPropertyNames(command))}`)

    return command.build()
}

