lsof -ti:3001 | xargs kill -9
      2>/dev/null && echo "Process
      killed" || echo "No process found
      on port 3001"