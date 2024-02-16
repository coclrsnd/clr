#!/bin/bash

# Create the ASP.NET Core HTTPS development certificate
dotnet dev-certs https -ep /app/MyCertificate.pfx -p new-guid
