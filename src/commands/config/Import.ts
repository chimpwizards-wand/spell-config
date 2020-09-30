import Debug from 'debug';
import { Command } from  '@chimpwizards/wand'
import { Config } from  '@chimpwizards/wand'
import { CommandDefinition, CommandParameter, CommandArgument } from '@chimpwizards/wand/commons/command/'
const chalk = require('chalk');
const debug = Debug("w:cli:config:import");
import * as fs from 'fs';
import * as yaml from 'js-yaml'
import * as _ from 'lodash';  

@CommandDefinition({ 
    description: 'Import configuration from lerna or meta',
    parent: 'config',
    examples: [
        [`config import lerna.json`, `Create the configuration based on a lerna.json file`],
        [`config import .meta`, `Create the configuration based on a .meta file`],        
    ]    
})
export class Import extends Command  { 

    @CommandArgument({ description: 'Metadata file to use to import into this workspace', required: true})
    from: string = '';

    execute(yargs: any): void {
        debug(`FROM ${this.from}`)
        console.log(`FROM ${chalk.green(this.from)} !!!`)
        var configInstance = new Config();
        var currentConfig = configInstance.load();
        var importedConfig : any = {}
        if (this.from == '.meta') {
            if (fs.existsSync(this.from)) {
                var meta = yaml.safeLoad(fs.readFileSync(this.from, 'utf8'));
                importedConfig = this.migrateFromMeta(meta);
                debug(`CONFIG: ${importedConfig}`);
            }
        } else if (this.from == 'lerna.json') {
            if (fs.existsSync(this.from)) {
                var lerna = yaml.safeLoad(fs.readFileSync(this.from, 'utf8'));
                importedConfig = this.migrateFromLerna(lerna);
                debug(`CONFIG: ${importedConfig}`);
            }
        }
        var newConfig = _.merge({}, currentConfig, importedConfig);
        configInstance.save({context: newConfig})

    }

    migrateFromMeta(meta: any) {
        var config : any = {};
        config.dependencies = []

        for (let key of Object.keys(meta.projects)) {
            if( key != "_chunk") {
                let value = meta.projects[key];
                key = key.replace("./","")
                let tags = key.split("/")
                tags.pop(); //Remove last one
                var dependency: any = {
                    path: key,
                    git: value,
                };
                if (tags.length>0) {
                    dependency['tags'] = tags
                }
                config.dependencies.push(dependency)
            }
        }

        
        return config;
    }

    migrateFromLerna(lerna: any) {
        var config : any = {};
        config.dependencies = []
        config.paths = []

        lerna.packages.forEach((key: any) => {
            config.paths.push(key.replace("/*",""));
        
        });


        return config;

    }

}

export function register ():any {
    debug(`Registering....`)
    let command = new Import();
    debug(`INIT: ${JSON.stringify(Object.getOwnPropertyNames(command))}`)

    return command.build()
}

