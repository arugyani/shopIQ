# Folder Structure

## Configs
Configs contain any configuration settings.

Items in this folder can include:
- Environment Variables
- Application Settings
- Database Configurations
- External Service Integrations
- Custom Configurations

## Controllers
Controllers process the incoming requests, interact with models to retrieve or modify data, and decide how to respond to the client (e.g., rendering a view or returning JSON data). They help to keep the route definitions clean and focused on routing rather than on business logic.

## Routes
Routes define the endpoints at which requests can be received and how those requests should be handled. Each route can have one or more handler functions, which are executed when the route is matched. Routes are defined by associating HTTP methods (such as `GET`, `POST`, `PUT`, `DELETE`, etc.) with URL paths, along with the logic to execute when those routes are hit.

## Services
Services typically contain modules or classes that define the business logic of your application. The purpose of the services folder is to encapsulate the core functionalities and business rules of your application.

## Utils
Utilities are helper functions or modules that provide a set of tools or methods to perform common, often repeated tasks across your application.

# Gemini API - ENV File
The Gemini API requires API secrets which can be found in discord/backend-notes
Put this `.env` file in your backend folder to unlock the gemini api.
Plz don't commit this env to github, if you do plz let Divyam know so he can create a new API Key thanks ; )

