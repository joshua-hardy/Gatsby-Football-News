import React from 'react';
import Match from "../Matches/Match";
import { Link } from "gatsby";

export const compareCompetitions = (comp1, comp2)=>{

  if (comp1.id === comp2.id){
    return 0;
  }
  if (comp1.popularity > 200){
    if (comp1.popularity > comp2.popularity){
      return -1;
    }else if (comp1.popularity === comp2.popularity){
      if (comp1.country.popularity > comp2.popularity){
        return -1;
      }else if (comp1.country.popularity === comp2.popularity){
        return (comp1.country.name <= comp2.country.name) ? -1 : -2;
      }
    }else{
      if (comp2.popularity < 200){
        return -1;
      }
    }
  }else {
    if (comp2.popularity > 200){
      return 1;
    }
    if (comp1.country.name < comp2.country.name){
      return -1
    } else if (comp1.country.name === comp2.country.name)
      if (comp1.name < comp2.name){
        return -1
      }
  }
  return 1;
}

export const completeCompetition = (c, countries)=>{
  const country = countries.find(e => e.id === c.country_id);
  c.country = country || "";
  c.matches = new Map();
  c.n_matches = 0;
}

export const completeLeague = (l, competitions)=>{
  const c = competitions.find(e => e.id === l.competition_id);
  l.competition = c || "";
}


class Competition extends React.Component {


  showList(matches, isLive) {
    if (isLive)
      return (<div>{matches[0].map(match=><Match key={match.id+"_"+match.updated} match={match} />)}{matches[1].map(match=><Match key={match.id+"_"+match.updated} match={match} />)}</div>)

    return (
      <div>
      {matches[0].map(match=><Match key={match.id+"_"+match.updated} match={match} />)}    
      {matches[1].map(match=><Match key={match.id+"_"+match.updated} match={match} />)}
      {matches[2].map(match=><Match key={match.id+"_"+match.updated} match={match} />)}
      </div>
    )
}

  render() {
   const { competition, matches, type, liveOnly } = this.props;
   console.log("print Comp " + competition.name + " -> " + competition.country.flag_url_medium ); //JSON.stringify(matches))

    if (liveOnly && ((matches[0].length + matches[1].length) < 1))
      return ("");
    var n_matches = matches[0].length + matches[1].length + matches[2].length;
    if (liveOnly && n_matches < 1)
      return ("");

      return (
      <div>
        <div class="row row-tall " data-type="stg">  
          <div class="clear">  
            <div class="left"> 
              <img class="flag" alt="flag" src={competition.country.flag_url_medium}/>
              <Link to="#"><strong>{competition.country.sname}</strong></Link> - <Link to="/soccer/belarus/premier/"> {competition.name}</Link> 
            </div>   
            <div class="right fs11"></div>  
          </div>  
        </div>
        {this.showList(matches, liveOnly)}
      </div>
      );
  }
}

export default Competition;
