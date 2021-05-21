import React from 'react';
import { compareCompetitions } from "../Competitions/Competition"
import "../../css/layout.css"
import {Link} from 'gatsby';

const STATUS_SCHEDULED    = 1;
const STATUS_FIRST_HALF   = 2;
const STATUS_HALF_TIME    = 3;
const STATUS_SECOND_HALF  = 4;
const STATUS_FINAL        = 5;
const STATUS_EXTRA        = 6;
const STATUS_PENALTIES    = 7;
const STATUS_EXTRA_FINAL  = 8;
const STATUS_PENALTIES_FINAL = 9;
const STATUS_ABANDONED    = 10;
const STATUS_POSTPONED    = 11;
const STATUS_FT_ONLY      = 12;
const STATUS_SUSPENDED    = 13;
const STATUS_PENALTIES_WITHOUT_EXTRA       = 14;
const STATUS_PENALTIES_FINAL_WITHOUT_EXTRA = 15;
const STATUS_WALKOVER     = 16;
const STATUS_ANNULLED     = 17;
const STATUS_CANCELLED    = 18;

export const isPlaying = (m)=>{
  let status_id = m.status_id;
  return (isJustFinished(m) || status_id === STATUS_FIRST_HALF || status_id === STATUS_HALF_TIME || status_id === STATUS_SECOND_HALF || status_id === STATUS_EXTRA || status_id === STATUS_PENALTIES || status_id === STATUS_PENALTIES_WITHOUT_EXTRA || status_id === STATUS_SUSPENDED);
}

export const isStarted = (m)=>{
  let status_id = m.status_id;
  return (status_id !== STATUS_SCHEDULED && status_id !== STATUS_POSTPONED) ;
}

export const isScheduled = (m)=>{
  let status_id = m.status_id;
  return (status_id === STATUS_SCHEDULED) ;
}

export const isJustFinished = (m)=>{
  return false;
}

export const isStatusFinshed = (m)=>{
  let status_id = m.status_id;
  return (status_id === STATUS_FINAL || status_id === STATUS_EXTRA_FINAL || status_id === STATUS_PENALTIES_FINAL || status_id === STATUS_ABANDONED || status_id === STATUS_POSTPONED || status_id === STATUS_FT_ONLY
          || status_id === STATUS_PENALTIES_FINAL_WITHOUT_EXTRA || status_id === STATUS_WALKOVER);
}

export const isEnded = (m)=>{
  let status_id = m.status_id;
  return ((status_id === STATUS_FINAL || status_id === STATUS_EXTRA_FINAL || status_id === STATUS_PENALTIES_FINAL || status_id === STATUS_ABANDONED || status_id === STATUS_CANCELLED || status_id === STATUS_POSTPONED || status_id === STATUS_FT_ONLY
          || status_id === STATUS_PENALTIES_FINAL_WITHOUT_EXTRA || status_id === STATUS_WALKOVER) && !isJustFinished());
}

export const isCancelled = (m)=>{
  let status_id = m.status_id;
  return (status_id === STATUS_ANNULLED || status_id === STATUS_CANCELLED);
}

export const isWalkOver = (m)=>{
  let status_id = m.status_id;
  return status_id === STATUS_WALKOVER;
}

export const isSuspended = (m)=>{
  let status_id = m.status_id;
  return status_id === STATUS_SUSPENDED;
}

export const isAbandoned = (m)=>{
  let status_id = m.status_id;
  return status_id === STATUS_ABANDONED;
}

export const isPostPoned = (m)=>{
  let status_id = m.status_id;
  return status_id === STATUS_POSTPONED;
}

export const isWhiteDraw = (m)=>{
  if (m.home != null  && m.guest != null)
      return (m.home.Goals() === 0 && m.guest.Goals() === 0);
  return false;
}

export const isExtraTimePlayed = (m)=>{
  let status_id = m.status_id;
  return (isStatusFinshed() && !(status_id === STATUS_PENALTIES_WITHOUT_EXTRA || status_id === STATUS_PENALTIES_FINAL_WITHOUT_EXTRA));
}

export const compareMatch = (match1, match2)=>{
  if (match1.start_date < match2.start_date)
    return -1;
  if (match1.start_date === match2.start_date){
    let i = compareCompetitions(match1.league.competition, match2.league.competition);
    if ( i !== 0)
      return i;
    let a = match1.teamHome.sname;
    let b = match2.teamHome.sname;
    return (a<b?-1:(a>b?1:0));
  }
  return 1
}

export const completeMatch = (match, data)=>{
  let leagues = data.leagues.list;
  let teams = data.teams.list;

  if (match.home == null || match.guest == null){
    console.log("MATCH ERROR " + JSON.stringify(match));
    return;
  }

  const league = leagues.find(e => e.id === match.league_id);
  const team_h = teams.find(t => t.id === match.home.team_id);
  const team_g = teams.find(t => t.id === match.guest.team_id);

  match.league = (league);
  match.teamHome  = team_h;
  match.teamGuest = team_g;
}

function getStatusLabel(match){
  let status_id = match.status_id;
  var extra = "";
  var statusString = "";
  
  if (isPlaying(match)){
    extra = (match.injury === true) ? "'+" : "'";
    statusString = !(match.minutes === "") ? match.minutes + extra : "-";
  }

  switch (status_id) {
        case STATUS_SCHEDULED:
            /*statusString = "";
            if ((available_mask & F24AvailableMaskResultAggregateFL) === F24AvailableMaskResultAggregateFL) {
                statusString = " (" + getFirstLeg() + ")";
            }*/
            
            var epoch = new Date(match.start_date * 1000);
            var offset = epoch.getTimezoneOffset() * 60;
            var start = new Date((match.start_date-offset) * 1000);;
            start = start.toISOString().slice(-13, -8);
            statusString = start;

            break;
        case STATUS_FIRST_HALF:
            break;
        case STATUS_HALF_TIME:
            statusString = "HT";
            break;
        case STATUS_SECOND_HALF:
            break;
        case STATUS_FINAL:
            statusString = "FT";
            break;
        case STATUS_EXTRA:
            statusString = "ET";
            break;
        case STATUS_PENALTIES:
        case STATUS_PENALTIES_WITHOUT_EXTRA:
            statusString = "Pen.";
            break;
        case STATUS_EXTRA_FINAL:
            statusString = "AET";
            break;
        case STATUS_PENALTIES_FINAL:
        case STATUS_PENALTIES_FINAL_WITHOUT_EXTRA:
            statusString = "AP";
            break;
        case STATUS_ABANDONED:
            statusString = "ABD";
            break;
        case STATUS_FT_ONLY:
            statusString = "FT Only";
            break;
        case STATUS_POSTPONED:
            statusString = "Post.";
            break;
        case STATUS_SUSPENDED:
            statusString = "Susp.";
            break;
        case STATUS_WALKOVER:
            statusString = "W.O.";
            break;
        case STATUS_ANNULLED:
            statusString = "Ann.";
            break;
        case STATUS_CANCELLED:
            statusString = "Canc.";
            break;
        default:
            statusString = "ERR";
            break;
    }
    return statusString;
}

function getResult(m) {
  let status_id = m.status_id;
  var resultString = "-";

  if ((isPlaying(m) || isEnded(m)) && !isPostPoned(m) && !isCancelled(m)) {
    if (status_id === STATUS_PENALTIES || status_id === STATUS_PENALTIES_WITHOUT_EXTRA) {
      resultString = m.home.results[4] + " - " + m.guest.results[4];
    } else {
      resultString = m.home.results[0] + " - " + m.guest.results[0];
    }      
  }
  return resultString;
}

export const findMatch = (id, matches)=>{
  return matches.find(e => e.id === id);
}

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { match, type } = this.props;

    if (type === "0"){
      return (
        <div>{match}</div>
      );
    }
    var ccolor = '#' + match.league.competition.background;
    return (
      <Link to="/TeamDetails/teamdetails/" replace class="match-row scorelink even">  
        <div style={{backgroundColor: ccolor}} class="compcolor"/>
        <div class="min "> <div> <span>{getStatusLabel(match)}</span></div> </div> 
        <div class="ply tright name"><span>{match.teamHome.sname}</span></div> 
        <div class="sco"> {getResult(match)} </div> 
        <div class="ply name"><span>{match.teamGuest.sname}</span></div>         
      </Link>
    )
  }

}

export default Match;
