// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

const path = require('path');
const { JsonFile } = require('@microsoft/node-core-library');
const {
  Extractor,
  ExtractorConfig,
  CompilerState
} = require('@microsoft/api-extractor');
import {
  ApiItemKind,
  ApiDocumentedItem,
  ApiMethod,
  ApiMethodSignature,
  ApiModel,
  ApiPackage,
  ApiProperty,
  ApiPropertySignature,
  ApiTypeAlias,
  ExcerptToken,
  IExcerptTokenRange
} from '@microsoft/api-extractor-model';
import { fstat, readdirSync, unlink } from 'fs-extra';
const { execSync } = require("child_process");

function runScenarios(buildConfigPath) {
  const buildConfig = JsonFile.load(buildConfigPath);

  const entryPoints = [];

  // TODO: Eliminate this workaround
  // See GitHub issue https://github.com/Microsoft/web-build-tools/issues/1017
  for (const scenarioFolderName of buildConfig.scenarioFolderNames) {
    const entryPoint = path.resolve(`../packages/meat/dist/${scenarioFolderName}/index.d.ts`);
    entryPoints.push(entryPoint);

    const apiExtractorJson = {
      '$schema': 'https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json',

      'mainEntryPointFilePath': entryPoint,

      'apiReport': {
        'enabled': true,
        'reportFolder': `<projectFolder>/etc/outputs/${scenarioFolderName}`
      },

      'dtsRollup': {
        'enabled': true,
        'untrimmedFilePath': `<projectFolder>/etc/outputs/${scenarioFolderName}/rollup.d.ts`
      },

      'docModel': {
        'enabled': true,
        'apiJsonFilePath': `<projectFolder>/etc/outputs/${scenarioFolderName}/<unscopedPackageName>.api.json`
      },

      'messages': {
        'extractorMessageReporting': {
          // For test purposes, write these warnings into .api.md
          // TODO: Capture the full list of warnings in the tracked test output file
          'ae-cyclic-inherit-doc': {
            'logLevel': 'warning',
            'addToApiReportFile': true
          },
          'ae-unresolved-link': {
            'logLevel': 'warning',
            'addToApiReportFile': true
          }
        }
      }
    };

    const apiExtractorJsonPath = `./temp/configs/api-extractor-${scenarioFolderName}.json`;

    JsonFile.save(apiExtractorJson, apiExtractorJsonPath, { ensureFolderExists: true });
  }

  let compilerState = undefined;
  let anyErrors = false;
  process.exitCode = 1;

  for (const scenarioFolderName of buildConfig.scenarioFolderNames) {
    const apiExtractorJsonPath = `./temp/configs/api-extractor-${scenarioFolderName}.json`;

    console.log('Scenario: ' + scenarioFolderName);

    // Run the API Extractor command-line
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);

    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints
      });
    }

    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true,
      compilerState
    });

    if (extractorResult.errorCount > 0) {
      anyErrors = true;
    }

    execSync(`api-documenter markdown -i ./etc/outputs/${scenarioFolderName} -o ./api/${scenarioFolderName}`);
    const apiModel = new ApiModel();
    // NOTE: later you can load other packages into the model and process them together
    const apiPackage = apiModel.loadPackage(`./etc/outputs/${scenarioFolderName}/docs.api.json`);
    const apiEntryPoint = apiPackage.entryPoints[0];
    const arr = [];
    for (const apiItem of apiEntryPoint.members) {
      if (apiItem instanceof ApiDocumentedItem) {
        switch (apiItem.kind) {
          case ApiItemKind.Interface:
          case ApiItemKind.Enum:
          case ApiItemKind.Class:
          case ApiItemKind.TypeAlias: {
            arr.push(('docs.'+apiItem.displayName+'.md').toLowerCase())
            break;
          }
        }
      }
    }

    const mds = readdirSync(`./api/${scenarioFolderName}`);
    mds.forEach(md=>{
      console.log('md', md)
      if(arr.indexOf(md) === -1){
        unlink(path.resolve(`./api/${scenarioFolderName}`, md));
      }
    })
    console.log("arr", arr)
  }

  if (!anyErrors) {
    process.exitCode = 0;
  }
}

module.exports = {runScenarios};