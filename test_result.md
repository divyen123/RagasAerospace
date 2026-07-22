\#====================================================================================================

# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION

\#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS

# BOTH MAIN\_AGENT AND TESTING\_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:

# If the `testing\\\_agent` is available, main agent should delegate all testing tasks to it.

# 

# You have access to a file called `test\\\_result.md`. This file contains the complete testing state

# and history, and is the primary means of communication between main and the testing agent.

# 

# Main and testing agents must follow this exact format to maintain testing data.

# The testing data must be entered in yaml format Below is the data structure:

# 

## user\_problem\_statement: {problem\_statement}

## backend:

## \- task: "Task name"

## implemented: true

## working: true  # or false or "NA"

## file: "file\_path.py"

## stuck\_count: 0

## priority: "high"  # or "medium" or "low"

## needs\_retesting: false

## status\_history:

## \-working: true  # or false or "NA"

## \-agent: "main"  # or "testing" or "user"

## \-comment: "Detailed comment about status"

## 

## frontend:

## \- task: "Task name"

## implemented: true

## working: true  # or false or "NA"

## file: "file\_path.js"

## stuck\_count: 0

## priority: "high"  # or "medium" or "low"

## needs\_retesting: false

## status\_history:

## \-working: true  # or false or "NA"

## \-agent: "main"  # or "testing" or "user"

## \-comment: "Detailed comment about status"

## 

## metadata:

## created\_by: "main\_agent"

## version: "1.0"

## test\_sequence: 0

## run\_ui: false

## 

## test\_plan:

## current\_focus:

## \- "Task name 1"

## \- "Task name 2"

## stuck\_tasks:

## \- "Task name with persistent issues"

## test\_all: false

## test\_priority: "high\_first"  # or "sequential" or "stuck\_first"

## 

## agent\_communication:

## \-agent: "main"  # or "testing" or "user"

## \-message: "Communication message between agents"

# Protocol Guidelines for Main agent

# 

# 1\. Update Test Result File Before Testing:

# \- Main agent must always update the `test\\\_result.md` file before calling the testing agent

# \- Add implementation details to the status\_history

# \- Set `needs\\\_retesting` to true for tasks that need testing

# \- Update the `test\\\_plan` section to guide testing priorities

# \- Add a message to `agent\\\_communication` explaining what you've done

# 

# 2\. Incorporate User Feedback:

# \- When a user provides feedback that something is or isn't working, add this information to the relevant task's status\_history

# \- Update the working status based on user feedback

# \- If a user reports an issue with a task that was marked as working, increment the stuck\_count

# \- Whenever user reports issue in the app, if we have testing agent and task\_result.md file so find the appropriate task for that and append in status\_history of that task to contain the user concern and problem as well

# 

# 3\. Track Stuck Tasks:

# \- Monitor which tasks have high stuck\_count values or where you are fixing same issue again and again, analyze that when you read task\_result.md

# \- For persistent issues, use websearch tool to find solutions

# \- Pay special attention to tasks in the stuck\_tasks list

# \- When you fix an issue with a stuck task, don't reset the stuck\_count until the testing agent confirms it's working

# 

# 4\. Provide Context to Testing Agent:

# \- When calling the testing agent, provide clear instructions about:

# \- Which tasks need testing (reference the test\_plan)

# \- Any authentication details or configuration needed

# \- Specific test scenarios to focus on

# \- Any known issues or edge cases to verify

# 

# 5\. Call the testing agent with specific instructions referring to test\_result.md

# 

# IMPORTANT: Main agent must ALWAYS update test\_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

\#====================================================================================================

# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION

\#====================================================================================================



\#====================================================================================================

# Testing Data - Main Agent and testing sub agent both should log testing data below this section

\#====================================================================================================

