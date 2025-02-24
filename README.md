# domo-automation-app
Domo platform automation example for Domopalooza 2025

Welcome!
This document is to serve as a instructional walkthrough for the DomoPalooza 2025 March 19, 2025 3:10 PM-3:50 PMMT "Hack the (Domo) planet! Administration Automation" breakout session.
This document will instruct a user on setting up a custom Domo application that will assist in performing platform automation.

Each DDX Brick has been separated in to it's own folder for easier navigation and understanding.
Feel free to use each brick individually or use all documented DDX Bricks in this repo. The choice is yours!

All Code Engine functions were written in JavaScript for easy understanding. Each function is altered to be non-platform specific and as such as safe to be distributed.
Remember to edit any link where contains {domain} to your Domo instance domain.

Instructions:
____________________________________________________________________________________
Set up new Code Engine Function Package

Step 1: 
Navigate to Code Engine 
Location: https://{domain}.domo.com/codeengine

Step 2: 
Create new Code Engine package

1.	Click "+ New package" in the top right of the browser window.
2.	Enter new package name
3.	Enter package description (optional)
4.	Click the "Select language" dropdown and select "JavaScript"
5.	Upload thumbnail image (optional)
6.	Click the "Create New Package" button bottom right of popup window.

Step 3: 
Set up Code Engine function
1.	Copy contents from "Code Engine" folder of chosen function and paste in to the Code Engine window.
2.	Select each function in the "select a function" drop down and edit the "Input" and "Output" parameters.
		Input:	
A.	Navigate to the bottom left to "Input" parameter section tab.
B.	Select parameter
C.	Change type of parameter (left of parameter name) to "text"
D.	Click checkmark at right of parameter name to save.
		Output: 
A.	Navigate to the bottom left to "Output" parameter section tab.
B.	Select parameter
C.	Change type of parameter (left of parameter name) to "Boolean"
D.	Change parameter name to "Done"
E.	Click checkmark at right of parameter name to save.
Step 4: 
Click "Save" drop down arrow at top right of browser and select "Save and Deploy" option to save Code Engine function
Step 5: 
Repeat steps 1 through 4 in this section to create additional Code Engine packages to perform additional automation tasks.
	(You are able to combine all the code engine functions into a single package. For the purposes of this exercise, each function package has been separated.)
____________________________________________________________________________________


Set up new Workflow

Step 1: 
Navigate to Workflows
Location: https://{domain}.domo.com/workflows

Step 2:
1.	Create New Workflow
2.	Click "+ New Workflow" in the top right of the browser window and select "blank workflow" option
3.	Enter new Workflow Name
4.	Enter version number (can remain 1.0.0)
5.	Add Description (optional)
6.	Click "Save" at bottom right of popup window

Step 3: 
Set up New Workflow
1.	In main area of browser, click "General Start"
2.	Navigate to right side of browser and click "Add Parameter" button
3.	In new popup, add Parameter Name (ex: param1)
4.	Select "Data Type" dropdown for parameter and change type (should be "text")
5.	Click "Add parameter" button at bottom right of popup window.
6.	Repeat for additional parameters if needed.
7.	Navigate to center of screen and click the "+" icon below the "General Start" icon
8.	Select the "Custom Function" option and select/search your Code Engine package.
9.	Select the Code Engine function from your selected package.
10.	Click the "Add Automation" button at the bottom of the popup window.
11.	Navigate to bottom right of browser to the "Input Parameter" area.
12.	Select the dropdown for each parameter and change type to match the expected type of the Code Engine function. (In this case "text")
13.	Navigate to bottom right of browser to the "Output Parameter" area.
14.	Select the dropdown for each parameter and change type to match the expected type of the Code Engine function. (In this case "Boolean")
15.	Navigate to center of screen and click the "+" icon below the most recent created workflow step icon
16.	Select/search for the "End" function and add to your workflow
17.	Name Workflow step "End"
18.	Navigate to top right of browser, select the menu option to the right of the "Save" button.
19.	Select the "Validate" option for review of any issues.
20.	Navigate to top right of browser, select the menu option to the right of the "Save" button.
21.	Select the "Deploy" option to activate the Workflow for use.
22.	Repeat steps 1 through 20 to create additional Workflows to handle additional Code Engine functions.


____________________________________________________________________________________

Create DDX Bricks

Step 1: 
Download DDX Brick from Appstore

Brick name: 
Workflow Start Form
Brick Location: https://{domain}.domo.com/appstore/details/C5942B22B905A5938F9A61C511C298AE2B7B2001E82AE9DF7EE949D5B6A2ED78

Edit Brick Code:
1.	Copy content from javascript.txt to section titled "JavaScript"
2.	Copy content from html.txt to section titled "html"
3.	Copy content from css.txt to section titled "css"
4.	Click the "Select Workflow" button and choose required workflow. (Make sure to select the correct version and function)
5.	Title DDX Brick
6.	Save Brick
7.	Repeat steps 1 through 6 in this section to create additional DDX Bricks to handle additional functions.
____________________________________________________________________________________
Create AppStudio App:
Navigate to AppStudio
Location: https://{domain}.domo.com/app-studio
1.	Click "+ Create New App" button at right side of the browser window
2.	Choose App Theme and Apply
3.	Click the "+" icon on the left side of the browser
4.	Select the "button" icon from the "Actions" section and drag it to the main area of the browser
5.	Click the new button and edit the properties
6.	On the right side of the screen, Edit the "Button Label" (optional)
7.	Select the "Actions" tab
8.	Select the "Select interaction type" drop down and select the "Open care in a popup" option
9.	Select your already created DDX Brick that contains your required function call process
10.	Repeat steps 1 through 5 in this section to add additional DDX Bricks.
11.	Edit App page name or any elements of the app to fit your desired look and feel.
12.	Click "Save" in the top right of the browser.
13.	Test APP and Share
