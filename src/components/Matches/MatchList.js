import React from 'react';
import Layout from '../layout'
import Competition, { completeCompetition, completeLeague, compareCompetitions } from "../Competitions/Competition";
import KicoffMatches from "./KickoffMatches";
import { completeMatch, compareMatch, isPlaying, isScheduled } from "./Match";
import { completeTeam } from "../Teams/Team";
import "../../css/layout.css"
import icon_refresh from "../../images/tab_refresh.png"
import icon_kickoff from "../../images/tab_kickoff.png"
import icon_comps from "../../images/tab_comps.png"
import icon_live_on from "../../images/tab_live_on.png"
import icon_live_off from "../../images/tab_live_off.png"

function orderCompetitions(competitions_server){  
  let orderedCompetitions = [];
  competitions_server.forEach(c => {   
    let index = 0;
    for (index = 0; index < orderedCompetitions.length; index++) {
      var c_ref = competitions_server.find(e=>e.id===orderedCompetitions[index].id);

      if (compareCompetitions(c, c_ref) < 0)
        break;
    }
    var matches = [[],[],[]];
    let c_elem = { id:c.id, matches:matches};
    orderedCompetitions.splice(index, 0, c_elem);

    //console.log(  c.country.sname + "-" + c.name.padStart(25, " ") + " - pop: " + c.popularity + " => index: " + index);
  });

  return orderedCompetitions;
}

function addMatchByDate(match, matches){
  let list = matches[0];

  if (isPlaying(match))         
    list = matches[0];          // live
  else if (isScheduled(match))  
    list = matches[1];          // scheduled
  else                  
    list= matches[2];           // ended
  
  for (var index = 0; index < list.length; index++) {
    if (compareMatch(match, list[index]) < 0)
      break;
  }
  list.splice(index, 0, match);

  return ;
}

function merge(a, b){
  // add or edit b elements in main array a

  b.forEach(element => {
    const index = a.findIndex((e) => e.id === element.id);
    console.log("updating match " + JSON.stringify(element));
    if (index === -1) {
      console.log("index NOT_FOUND " + element.id);
        a.push(b);
    } else {
        console.log("index FOUND " + element.id);
        a[index] = element;
    }
  });
  return a;
}

function rangeChanged(old_range, new_range){
  return (old_range.day !== new_range.day || old_range.start !== new_range.start || old_range.end !== new_range.end) ? true : false;
}

///////////////////////////     COMPONENT


class MatchList extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS: " + JSON.stringify(props));

    const isLive =  false;
    const order  =  0;   // 1: comps, 0: date

    this.state = {
      reloadData: false,
      isLive: isLive,
      order:  order,
      update: 0
    }
  }

  getMergedData(old_data, new_data){
  
    if (old_data == null || rangeChanged(old_data.range, new_data.range)){
      console.log("switching to new data " + (old_data ? "range_changed" : "no_storage"));
      return new_data;
    }
    
    if (new_data.status.update_competitions > old_data.status.update_competitions) {
      merge(old_data.competitions.list, new_data.competitions.list);
    }
    if (new_data.status.update_leagues > old_data.status.update_leagues) {
      merge(old_data.leagues.list, new_data.leagues.list);
    }
    if (new_data.status.update_countries > old_data.status.update_countries) {
      merge(old_data.countries.list, new_data.countries.list);
    }
    if (new_data.status.update_teams > old_data.status.update_teams) {
      merge(old_data.teams.list, new_data.teams.list);
    }
    if (new_data.status.update_matches > old_data.status.update_matches) {
      old_data.matches.list = merge(old_data.matches.list, new_data.matches.list);
    }

    old_data.status = new_data.status;
    old_data.range = new_data.range;
    
    return old_data;
  }

  buildData(resp) {    
    const { 
      data,
      update
    } = this.state;
    let data_updated = resp.result;

    if (data != null){
      //var now = Math.floor((+new Date ) / 1000) ;
      //data_updated.range.start = now;
      //data_updated.status.update_matches = now;
/*
      console.log("check update data_old " + data.status.update_matches);
      console.log("now: " + now);
      var am = data_updated.matches.list[0];
      data_updated.matches.list = [];
      data_updated.matches.countries = [];
      data_updated.matches.leagues = [];
      data_updated.matches.competitions = [];
      data_updated.matches.teams = [];
      am.status_id = 2;
      am.updated = now;
      var mm = findMatch(am.id, data.matches.list);
      console.log("found oldm atch: " + JSON.stringify(am));
      var min = mm.minutes;
      min = Number(min) + 1;
      console.log("min matc " + min);
      am.minutes = (mm != null) ? min.toString() : "1";
      am.home.results[0] = 1;
      data_updated.matches.list[0] = am;
      */
    }


    if (update === data_updated.status.update_matches){
      console.log("nothinkg to do...");
      return;
    }

    var data_merged = this.getMergedData(data, data_updated);
    let competitions_server = data_merged.competitions.list;
    let leagues = data_merged.leagues.list;
    let countries = data_merged.countries.list;
    let teams = data_merged.teams.list;

//    if (data != null)
          //data_updated.status.update_matches =  data.status.update_matches;

    competitions_server.forEach(c => {
      //if (c.updated > update)
        completeCompetition(c, countries);
    });

    leagues.forEach(l => {
      //if (l.updated > update)
        completeLeague(l, competitions_server);
    });

    teams.forEach(t => {
      //if (t.updated > update)
        completeTeam(t, countries);
    });

    let orderedCompetitions = orderCompetitions(competitions_server);
    
    var matchesKickOff = [[],[],[]];    // 0: live, 1: next, 2: ended

    data_merged.matches.list.forEach(m => {
      //if (m.updated > update){
        //console.log("completing match " + m.id );
        completeMatch(m, data_merged);
      //}
      let c = orderedCompetitions.find(e => e.id === m.league.competition_id);
      addMatchByDate(m, c.matches);
      addMatchByDate(m, matchesKickOff);
    });

    this.setState ( {
      reloadData: true,
      data: data_merged,
      orderedCompetitionsIDWithMatches: orderedCompetitions,
      matchesKickOff: matchesKickOff,
      update: data_merged.status.update_matches
    })
    console.log("DATA_BUILT " + data_merged.status.update_matches + " Ordered: " + orderedCompetitions.length + " Comps: " + competitions_server.length);
  
  }

  getMatchesWithXHR = async () => {
    const { update } = this.state;

    console.log("fetching data... " + update);
    var xhr = new XMLHttpRequest()
    if (update === 0) 
      xhr.open("GET", 'http://api.ls.gluak.com/matches/day', true)
    else
      xhr.open("GET", 'http://api.ls.gluak.com/matches/update/' + update, true)

    
    xhr.send();
    xhr.onload = function(e){
      if (xhr.readyState === 4){
        if (xhr.status === 200){
          //console.log("fetched data XHR... 200 => " + (xhr.response));
          var resp = JSON.parse(xhr.response); 
          this.buildData(resp);
        } else {
          console.log("REQ ERROR: " + xhr.statusText)
        }
      }
    }.bind(this)
  }

  getMatches = async () => {
    let resp;
    const { update } = this.state;

    console.log("fetching data...");
    try {
      let response;
      if (update === 0)
        response  = await fetch(`http://api.ls.gluak.com/matches/day`);
      else
        response  = await fetch(`http://api.ls.gluak.com/matches/update/` + update);

      resp = await response.json();
      console.log("res..." + resp);
  
    } catch (err) {
      resp = [];
      console.log("res..." + err);
    }
  
    this.buildData(resp);
  } 

  componentWillUnmount() {
    /*if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }*/
  }

  componentDidMount () {
    console.log("MATCH_LIST MOUNTED");
    this.getMatchesWithXHR();
    this.interval = setInterval(this.getMatchesWithXHR, 5000)
  }

  refresh = () => {
    this.getMatchesWithXHR();
  }

  toggleOrder = () => {
    const { order } = this.state;
    this.setState({order: (order) ? 0:1});
    console.log("toggle order: " + order);
  }

  toggleLive = () => {
    const { isLive } = this.state;
    this.setState({isLive: (isLive) ? 0:1});
  }

  showCalendar() {
    var month = [];
    month[0] = "JAN";
    month[1] = "FEB";
    month[2] = "MAR";
    month[3] = "APR";
    month[4] = "MAY";
    month[5] = "JUN";
    month[6] = "JUL";
    month[7] = "AUG";
    month[8] = "SEP";
    month[9] = "OCT";
    month[10] = "NOV";
    month[11] = "DEC";

    var today = new Date();
    var y = new Date();
    var yy = new Date();
    var t = new Date();
    var tt = new Date();

    y.setDate(today.getDate() - 1);
    yy.setDate(today.getDate() - 2);
    t.setDate(today.getDate() + 1);
    tt.setDate(today.getDate() + 2);

    return(
      <div class="date-bar" data-type="date-bar"> 
        <a href="/soccer/2020-04-14/">{month[yy.getMonth()]} <span>{yy.getDate()}</span></a> 
        <a href="/soccer/2020-04-15/">{month[y.getMonth()]} <span>{y.getDate()}</span></a> 
        <a href="/" class="selected">TODAY</a>
        <a href="/matches?day?1">{month[t.getMonth()]} <span>{t.getDate()}</span></a> 
        <a href="/page-2?day=2">{month[tt.getMonth()]} <span>{tt.getDate()}</span></a> 
      </div>              
    )
  }

  showButton() {
    const { 
      order,
      isLive
    } = this.state;
  
    var type;
    var order_icon;
    var live;
    var live_icon;

    if (order === 1){
      type = "Kickoff";
      order_icon = icon_kickoff;
    }else{
      type = "Competitions";
      order_icon = icon_comps;
    }

    if (isLive){
      live_icon = icon_live_off
      live = "All"
    }else{
      live_icon = icon_live_on
      live = "Live"
    }

    return(
      <div class="date-bar" data-type="date-bar"> 
        <a href="#" onClick={() => this.toggleOrder()}><img width="18px" alt="" src={order_icon}></img> {type}</a>
        <a href="#" onClick={() => this.refresh()}>    <img width="18px" alt="" src={icon_refresh}></img> Refresh</a>
        <a href="#" onClick={() => this.toggleLive()}> <img width="18px" alt="" src={live_icon}></img> {live}</a>
      </div>
    )
  }

  showContainer() {
    const { 
      data,
      order,
      orderedCompetitionsIDWithMatches,
      matchesKickOff,
      isLive
    } = this.state;

    return (order === 1) ?
      <div>{orderedCompetitionsIDWithMatches.map(c=><Competition key={c.id} competition={data.competitions.list.find(e=> e.id===c.id)} matches={c.matches} liveOnly={isLive}/>)}</div>
        :
      <KicoffMatches matches={matchesKickOff} liveOnly={isLive} />
  }

  render() {
    const { 
      update
    } = this.state;
        
    // data not ready
    if (this.state.reloadData === false){
      return (
        <Layout key={update} title="Futbol24" description="Futbol24 Matches List">
          <div>loading...</div>
          <button onClick={() => this.refresh()}>
          Refresh
          </button>
        </Layout>
      );      
    }

    return (
      <Layout key={update} title="Futbol24" description="Futbol24 Matches List">
          {this.showCalendar()}
          {this.showButton()}
          <div data-type="container" style={{display: 'block'}}> 
            {this.showContainer()}
          </div>
      </Layout>
    )
  }
} // class

export default MatchList;
