myArgs <- commandArgs(trailingOnly = TRUE)
function_choice <- myArgs[1]

download.file("http://localhost:3000/search/csv/flowmez", 'file')
global_c <- read.csv2('file',  sep = ',', dec = '.', header = T,row.names=NULL)
function_choice <- 'flowmez'
#print('file')
#print(global_c[2])
player <- 'flowmez' #el nombre del archivo no conserva mayusculas
player_local <-'flowmez'

#global_c <- read.csv2(file = paste(file,'.csv', sep = ''), sep = ',', dec = '.', header = T,row.names=NULL)
global_c$summonerName <- as.character(global_c$summonerName) # Codifica como factor, hay que cambiar a cadena
global_c <- subset(global_c,subset = global_c$summonerName==paste(player_local)) # Subset del player
#global_c$creepsPerMinDeltas.0.10<-as.numeric(as.vector.factor(global_c$creepsPerMinDeltas.0.10))
global_c<-subset(global_c,!(is.na(global_c$creepsPerMinDeltas.0.10[]))) #Elimino surrenders

gold_by_time_c <- global_c['goldEarned']/global_c['gameDuration']
names(gold_by_time_c)[1] <- 'gold_by_time'
global_c<-cbind(global_c,gold_by_time_c) # añado a global


vision_score_avg_c <- sum(global_c["visionScore"])/length(global_c[,1])
vision_score_wardsbought_avg_c<- sum(global_c['visionWardsBoughtInGame'])/length(global_c[,1])
vision_score_wardskilled_avg_c <- sum(global_c["wardsKilled"],na.rm = T)/length(global_c[,1])
vision_score_wardsplaced_avg_c <- sum(global_c['wardsPlaced'],na.rm = T)/length(global_c[,1])        

cctiming_avg_c <- sum(global_c['timeCCingOthers'])/length(global_c[,1]) 
crowdcontrol_time_avg_c <- sum(global_c['totalTimeCrowdControlDealt'])/length(global_c[,1]) 

# us1_c <- global_c['totalTimeCrowdControlDealt']/max(global_c["totalTimeCrowdControlDealt"])
#  us2_c <- global_c['visionScore']/max(global_c["visionScore"])
#   us3_c <- gold_by_time_c/max(gold_by_time)
# 
#     ust_c <- (us1_c[]+us2_c[]+us3_c[])/3
#       ust_avg_c <- sum(ust_c[])/length(ust_c[,1])

(total_dmg_dealt_avg_c <- sum(global_c['totalDamageDealt'])/length(global_c[,1]))
(dmg_taken_avg_c <- sum(global_c['totalDamageTaken'])/length(global_c[,1]))
(true_dmg_taken_avg_c<- sum(global_c['trueDamageTaken'])/length(global_c[,1]))
(dmg_dealt_champs_ <- (sum(global_c['totalDamageDealtToChampions'])/length(global_c[,1])))
invisible(capture.output(dmg_dealt_taken_c<- quiet(global_c['totalDamageDealt']/global_c['totalDamageTaken'])))

invisible(capture.output(dmg_score_c <- dmg_dealt_taken_c[]*global_c['damageSelfMitigated']))
#dmg_score$stats.totalDamageDealt <- as.double(dmg_score$stats.totalDamageDealt)
invisible(capture.output(dmg_score_avg_c  <- sum(dmg_score_c[])/length(dmg_score_c)))


invisible(capture.output(dmg_dealt_taken_c<- quiet(global_c['totalDamageDealt']/global_c['totalDamageTaken'])))
invisible(capture.output(dmg_score_c <- dmg_dealt_taken_c[]*global_c['damageSelfMitigated']))
#dmg_score$stats.totalDamageDealt <- as.double(dmg_score$stats.totalDamageDealt)
invisible(capture.output(dmg_score_avg_c  <- sum(dmg_score_c[])/length(dmg_score_c[,1])))




(total_dmg_dealt_avg_c <- sum(global_c['totalDamageDealt'])/length(global_c[,1]))
(total_dmg_taken_avg_c <- sum(global_c['totalDamageTaken'])/length(global_c[,1]))
(dmg_dealt_champs_c <- (sum(global_c['totalDamageDealtToChampions'])/length(global_c[,1])))
(dmg_dealt_objectives_c <- sum(global_c['damageDealtToObjectives'])/length(global_c[,1]))

dmg_dealt_torrets_c <- sum(global_c['damageDealtToTurrets'])/length(global_c[,1])
dmg_dealt_objectives_c <- sum(global_c['damageDealtToObjectives'])/length(global_c[,1])
objective_score_c <- (dmg_dealt_torrets_c + dmg_dealt_objectives_c)/2

for (i in 1:length(global_c[,1])) {
  
  if (global_c['deaths'][i,]==0) {
    
    global_c['deaths'][i,]=1;
    
  } else i=i+1 
  
}     
kda_c <- (global_c['kills']+global_c['assists']) / global_c['deaths']
kda_avg_c <- sum(kda_c[])/length(kda_c[,1])

creep_early_avg_c<- sum(global_c$csDiffPerMinDeltas.0.10,na.rm = T)/length(subset(global_c$csDiffPerMinDeltas.0.10,!(is.na(global_c$csDiffPerMinDeltas.0.10))))
creep_mid_avg_c<-sum(global_c$csDiffPerMinDeltas.10.20,na.rm = T)/length(subset(global_c$csDiffPerMinDeltas.10.20,!(is.na(global_c$csDiffPerMinDeltas.10.20))))
creep_avg_c <- (creep_early_avg_c+creep_mid_avg_c)/2 #revisar.sumatorio de todos casos entre la suma del lengths de los dos vectores, mejor
farming_rate_c <- global_c$totalMinionsKilled/global_c$gameDuration
farming_rate_avg_c<- mean(farming_rate_c)

(table(global_c$role)) # Roles jugados
sort(table(global_c$role),decreasing=TRUE)[1] # Rol + jugado
main <- names(sort(table(global_c$role),decreasing=TRUE)[1])

(table(global_c$win)) # Win
levels(global_c$win)<- c(0,1) # Sustituyo por 0 derrota y 1 victoria

df <- data.frame( crowdcontrol_time_avg_c, 
cctiming_avg_c, 
 vision_score_avg_c, 
 vision_score_wardsbought_avg_c,
 vision_score_wardskilled_avg_c, 
 vision_score_wardsplaced_avg_c, 
 objective_score_c, 
 dmg_dealt_objectives_c, 
 dmg_dealt_torrets_c,  
 creep_early_avg_c, 
 creep_mid_avg_c, 
 creep_avg_c, 
 farming_rate_avg_c,  
 kda_avg_c)



print(df)