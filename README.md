# Serverless Demo MobileCamp Dresden 2016

Die Demo ist stark angelehnt an das Buch [Learn Serverless](http://learnserverless.club) von, Philipp Müns. (ein sehr guter Einstieg)

## Erforderlich

*  AWS Account
*  IAM User mit entsprechenden Berechtigungen (oder "Admin"-Rechten)

## Setup

Projekt-Verzeichnis anlegen:

    $ mkdir serverless-mcdd16

nodejs installieren:

    $ nodeenv --node=4.4.1 env
     * Install node (4.4.1)... done.

Environment Variablen setzen:

    $ source env/bin/activate

Umgebung prüfen:

    $ which node
    /Users/stefan/Developer/serverless-mcdd16/env/bin/node

    $ which npm
    /Users/stefan/Developer/serverless-mcdd16/env/bin/npm

[serverless-Framework][serverless] installieren:

    $ npm install serverless -g
    ...

Setup verifizieren:

    $ which serverless
    /Users/stefan/Developer/serverless-mcdd16/env/bin/serverless

Projekt erstellen:

    $ serverless project create
     _______                             __
    |   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
    |   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
    |____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
    |   |   |             The Serverless Application Framework
    |       |                           serverless.com, v0.5.5
    `-------'

    Serverless: Initializing Serverless Project...  
    Serverless: Enter a name for this project:  (serverless-hy0lgg) serverless-mcdd16
    Serverless: Enter a new stage name for this project:  (dev) dev
    Serverless: For the "dev" stage, do you want to use an existing Amazon Web Services profile or create a new one?
      > Existing Profile
        Create A New Profile
    Serverless: Select a profile for your project:
      > serverless-admin_dev
    Serverless: Creating stage "dev"...  
    Serverless: Select a new region for your stage:
        us-east-1
        us-west-2
      > eu-west-1
        eu-central-1
        ap-northeast-1
    Serverless: Creating region "eu-west-1" in stage "dev"...  
    Serverless: Deploying resources to stage "dev" in region "eu-west-1" via Cloudformation (~3 minutes)...  
    Serverless: Successfully deployed "dev" resources to "eu-west-1"  
    Serverless: Successfully created region "eu-west-1" within stage "dev"  
    Serverless: Successfully created stage "dev"  
    Serverless: Successfully initialized project "serverless-mcdd16"    

Der Vorgang kann durchaus 3 Minuten dauern.

## Was bisher geschah? (1)

*   CloudFormation Stack wurde angelegt (Screenshot)
*   IAM Role wurden angelegt (via CF)
*   IAM Policy wurden angelegt (via CF)

## Das Demo Projekt

Webservice, der es erlaubt:

*   eine Person anzulegen
*   eine Liste von Personen abzurufen
*   Daten einer bestimmten Person (anhand ihrer ID) abzurufen
*   Daten einer bestimmten Person zu aktualisieren
*   eine Person zu entfernen


REST WS nach Lehrbuch:

| Methode | URL                                             | Beschreibung                 |
| :------ | :---------------------------------------------- | ---------------------------- |
| POST    | /persons/                                       | Person anlegen               |
| GET     | /persons/                                       | Liste von Personen abrufen   |
| GET     | /persons/8870BD18-4CD4-47EC-855A-FFFFE11CA2EB/  | Person mit ID abrufen        |
| POST    | /persons/8870BD18-4CD4-47EC-855A-FFFFE11CA2EB/  | Person mit ID aktualisieren  |
| DELETE  | /persons/8870BD18-4CD4-47EC-855A-FFFFE11CA2EB/  | Person mit ID entfernen      |

Bitte nicht so:

| Methode | URL                                             | Beschreibung                 |
| :------ | :---------------------------------------------- | ---------------------------- |
| GET     | /createPerson/?name=Max&givenName=Mustermann    | Person anlegen               |
| GET     | /listPersons                                    | Liste von Personen abrufen   |
| ...     | ...                                             | ...                          |

Tipp: [White-House API Standards](https://github.com/WhiteHouse/api-standards)

### Next

In Projekt-Verzeichnis wechseln:

    $ cd serverless-mcdd16/
    § pwd
    /Users/stefan/Developer/serverless-mcdd16/serverless-mcdd16

### DynamoDB anbinden

Dazu müssen die CF Ressourcen angepasst werden:

    "DynamoDbPersonsTable": {
      "Type": "AWS::DynamoDB::Table",
      "DeletionPolicy": "Retain",
      "Properties": {
        "AttributeDefinitions": [
          {
            "AttributeName": "id",
            "AttributeType": "S"
          }
        ],
        "KeySchema": [
          {
            "AttributeName": "id",
            "KeyType": "HASH"
          }
        ],
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 1,
          "WriteCapacityUnits": 1
        },
        "TableName": "${project}-persons-${stage}"
      }
    }

Für den Zugriff auf die DynamoDB Tabelle muss eine IAM Policy erweitert werden:

    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "arn:aws:dynamodb:${region}:*:table/${project}-persons-${stage}"
    }

### Was bisher geschah? (2)

*   CloudFormation Stack wurde aktualisiert
*   IAM Policy wurden erweitert (via CF)
*   DynamoDB Table wurde angelegt (via CF)


### Business Logik auslagern

Verzeichnis `functions/lib/` anlegen:

    $ mkdir -p functions/lib/

Leere `package.json` im Verzeichnis `functions/lib/` ablegen und Dependencies
installieren.

    $ npm install --save aws-sdk
    npm install --save aws-sdk
    npm WARN package.json persons-functions-lib@0.1.0 No description
    npm WARN package.json persons-functions-lib@0.1.0 No repository field.
    npm WARN package.json persons-functions-lib@0.1.0 No README data
    npm WARN package.json persons-functions-lib@0.1.0 No license field.
    aws-sdk@2.3.14 node_modules/aws-sdk
    ├── sax@1.1.5
    ├── xml2js@0.4.15
    ├── jmespath@0.15.0
    └── xmlbuilder@2.6.2 (lodash@3.5.0)

    $ npm install --save uuid
    npm WARN package.json persons-functions-lib@0.1.0 No description
    npm WARN package.json persons-functions-lib@0.1.0 No repository field.
    npm WARN package.json persons-functions-lib@0.1.0 No README data
    npm WARN package.json persons-functions-lib@0.1.0 No license field.
    uuid@2.0.2 node_modules/uuid

### Erste Funktion erstellen

Erste Funktion erstellen:

    $ serverless function create functions/create
    Serverless: Please, select a runtime for this new Function
    > nodejs4.3
      python2.7
      nodejs (v0.10, soon to be deprecated)
    Serverless: For this new Function, would you like to create an Endpoint, Event, or just the Function?
    > Create Endpoint
      Create Event
      Just the Function...
    Serverless: Successfully created function: "functions/create"

Die Funktion muss entsprechend angepasst werden:
 
*  Handler in `functions/create/handler.js` 
*  Mapping/Endpoint in `functions/create/s-function.json` 

(wird hier nicht häher beschrieben)

### Deployment

    $ serverless dash deploy
     _______                             __
    |   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
    |   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
    |____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
    |   |   |             The Serverless Application Framework
    |       |                           serverless.com, v0.5.5
    `-------'
    
    Use the <up>, <down>, <pageup>, <pagedown>, <home>, and <end> keys to navigate.
    Press <enter> to select/deselect, or <space> to select/deselect and move down.
    Press <ctrl> + a to select all, and <ctrl> + d to deselect all.
    Press <ctrl> + f to select all functions, and <ctrl> + e to select all endpoints.
    Press <ctrl> + <enter> to immediately deploy selected.
    Press <escape> to cancel.

    Serverless: Select the assets you wish to deploy:
      create
      >   function - create
          endpoint - persons - POST
        - - - - -
        Deploy
        Cancel

Function und Enspoint auswählen und deployen.

### CORS?

Aufgrund von CORS ist der Zugriff auf die API nur von der gleichen Domain
möglich. Aber, es gibt ein Plugin:

    npm install --save serverless-cors-plugin

Das Plugin muss im File `s-project.json` entsprechend aktiviert werden:

    {
      "name": "serverless-mcdd16",
      "custom": {},
      "plugins": [
        "serverless-cors-plugin"
      ]
    }

### Test des Services
 
Basis URL zum Webservice:

    export BASE_URL=https://551wt4ughc.execute-api.eu-west-1.amazonaws.com/dev/


#### Anlege einer Personen

Request:

    curl $BASE_URL/persons -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json' --data-binary '{"person": {"name": "Warhole", "givenName": "Andy" } }'

Response:
    
    {
        "person": {
            "name": "Warhole",
            "givenName":"Andy",
            "id":"755fd650-2001-11e6-b308-6f70f5c5c7ce",
            "createdAt":1463910131766,
            "lastModified":1463910131766
        }
    }

#### Auflisten von Personen

Request:

    http $BASE_URL/persons/
    
Response:
    
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Length: 316
    Content-Type: application/json;charset=UTF-8
    Date: Sun, 22 May 2016 09:02:39 GMT
    Via: 1.1 7922e01ab53e8f36477272573223ab35.cloudfront.net (CloudFront)
    X-Amz-Cf-Id: 0AyjcKT1q71SApHg89LnibLYsxtn8ClhMydaRKaDde8M1PD3UOho3A==
    X-Cache: Miss from cloudfront
    x-amzn-RequestId: ee96eef3-1ffb-11e6-b0c2-b5369744942c
    {
        "persons": [
            {
                "createdAt": 1463782043195, 
                "givenName": "Robert", 
                "id": "3aa320b0-1ed7-11e6-948a-01aa8f8b20d4", 
                "lastModified": 1463782043195, 
                "mail": "bob@dylan.com", 
                "name": "Zimmermann"
            }, 
            {
                "givenName": "Andy", 
                "id": "126a6b70-1f14-11e6-9461-2d4323fc8978", 
                "lastModified": 1463808175015, 
                "mail": "andy@warhole.info", 
                "name": "Warhole"
            }
        ]
    }

#### Abrufen einer Personen

Request:

    http GET $BASE_URL/persons/126a6b70-1f14-11e6-9461-2d4323fc8978/
    
Response:
    
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Length: 316
    Content-Type: application/json;charset=UTF-8
    Date: Sun, 22 May 2016 09:02:39 GMT
    Via: 1.1 7922e01ab53e8f36477272573223ab35.cloudfront.net (CloudFront)
    X-Amz-Cf-Id: 0AyjcKT1q71SApHg89LnibLYsxtn8ClhMydaRKaDde8M1PD3UOho3A==
    X-Cache: Miss from cloudfront
    x-amzn-RequestId: ee96eef3-1ffb-11e6-b0c2-b5369744942c
    {
        "person": {
            "createdAt": 1463782043195, 
            "givenName": "Robert", 
            "id": "3aa320b0-1ed7-11e6-948a-01aa8f8b20d4", 
            "lastModified": 1463782043195, 
            "mail": "bob@dylan.com", 
            "name": "Zimmermann"
        }
    }


#### Entfernen einer Personen

Request:

    http DELETE $BASE_URL/persons/126a6b70-1f14-11e6-9461-2d4323fc8978/
    
Response:
    
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Length: 2
    Content-Type: application/json;charset=UTF-8
    Date: Sun, 22 May 2016 09:38:27 GMT
    Via: 1.1 b4ee4db849dcb5fce83f0bc3d6a9d57f.cloudfront.net (CloudFront)
    X-Amz-Cf-Id: lZVM-niGq6LZMy1Z4e95ROAlwSuKpfbS3n8uiVfQdALKrX0wiYbcbQ==
    X-Cache: Miss from cloudfront
    x-amzn-RequestId: eec0562a-2000-11e6-92ba-0bd77b05dc73
    
    {}
    
## WTF?!

#### Q: "Select a profile for your project:"?

Gemeint ist ein Set von Credentials in `~/.aws/credentials`.


[serverless]: https://github.com/serverless/serverless
