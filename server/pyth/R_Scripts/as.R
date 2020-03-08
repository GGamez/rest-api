myArgs <- commandArgs(trailingOnly = TRUE)

download.file("http://localhost:3000/search/csv/flowmez", 'file.csv')
file <- read.csv("file.csv")
function_choice <- myArgs
print(file)
