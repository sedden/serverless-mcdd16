# Serverless Demo MobileCamp Dresden 2016

## Motivation

TBD

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

## Das Projekt

Webservice, der es erlaubt:

*   eine Person anzulegen
*   eine Liste von Personen abzurufen
*   Daten einer bestimmten Person (anhand ihrer ID) abzurufen
*   Daten einer bestimmten Person zu aktualisieren
*   eine Person zu entfernen

> There are only two hard things in Computer Science: cache invalidation and naming things.
>
> -- Phil Karlton

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

TBD: Link zum White-House API Standards

## Go

In Projekt-Verzeichnis wechseln:

    $ cd serverless-mcdd16/
    § pwd
    /Users/stefan/Developer/serverless-mcdd16/serverless-mcdd16

Verzeichnis `functions` anlegen:

    $ mkdir -p functions

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



## WTF?!

### Q: "Select a profile for your project:"?

Gemeint ist ein Set von Credentials in `~/.aws/credentials`.

[serverless]: https://github.com/serverless/serverless
