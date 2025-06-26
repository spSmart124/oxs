<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">lts: Local Template Server</h3>

  <p align="center">This project helps to create local template based on API using spring boot web application</p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project
This project helps to create local template based on API using spring boot web application

### Built With
This project is built using spring boot web.

### Top contributors:
Sribatsa Pradhan

<!-- CONTACT -->
## Contact

Your Name - Sribatsa Pradhan


Introduction
Vocal For Local (VFL)
This is a productivity tool for GCS Engineers working on cases.
It addresses challenges in managing logs, files, screenshots etc. collected in a case and taking notes on the observation by the engineer.
It gives a dedicated/unified folder for a case directly associated with corresponding Salesforce case.
It has a browser extension to create folder and template file associated with case by prepopulating important details like orgid, POD, secure agent name, case description etc.
It will open the folder created in Windows Explorer and open the template file created in your text editor of choice (e.g Notepad++)
Use case / Scenario
It is helpful on cases where a lot of logs, screenshots, analysis of different tools are captured involving multiple teams like Engineering and Product Specialist.

It gives a flexible template as JSON to keep note of useful observations drawn from the analysis.
Features
Creates a folder and a template file associated with a Salesforce case.
It opens the folder automatically in Windows Explorer and open the template file created in your text editor of choice (e.g Notepad++).
It opens the folder and the template file when the extension button is used from second time onwards.
Installation Step
Install browser extension
Create a OneDrive link
Click VFL  & Sign-in to OneDrive.
Click on Add shortcut to My files .

Then Open Windows Explorer in your laptop.
Go to  OneDrive - Informatica
Right click on VFL folder & select  Always Keep on this device (note the OneDrive sync will take sometime)

Open browser and open the url chrome://extensions  for chrome and  edge://extensions  for edge and enable Developer Mode.

Click Load Unpacked & Choose ltbe folder from Explorer → OneDrive - Informatica\VFL\ltbe.
Install local server
Add your text editor's installation path to PATH environment variable
Search for "environment variable" by clicking on windows icon

Click on "Environment Variables" button

Click on Path and Click Edit

Add path of your editor's installation location e.g C:\Program Files\Notepad++ for Notepad++ in the Path Variable and Click OK
Click OK and then OK

Open Powershell by searching for it after clicking on Windows icon

Execute the command Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Navigate to the folder "C:\Users\<your_username>\OneDrive - Informatica\VFL\lts\script" using the command cd "C:\Users\<your_username>\OneDrive - Informatica\VFL\lts\script"
Execute the script Install-Lts.ps1 using command .\Install-Lts.ps1

Press Enter two times if you want to accept default configuration which will install the app in your organization (Informatica) OneDrive location.
Close the Powershell console
Open Powershell once more and execute the command Set-ExecutionPolicy Default -Scope CurrentUser -Force

The app will be started automatically after reboot. So, it will work fine without any more action after the laptop is restarted.

Sample Run Output
Click on the extension button



Folder in File Explorer


Template file in notepad++
