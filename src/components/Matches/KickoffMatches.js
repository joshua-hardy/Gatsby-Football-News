import React from 'react';
import Match from "../Matches/Match"
import icon_next from "../../images/row_header_next.png"
import icon_ended from "../../images/row_header_ended.png"
import icon_live from "../../images/row_header_live.png"

class KickoffMatches extends React.Component {

  showList(list, title, icon) {
    const header_icon = {
      width: '18px',
      height:'18px',
    }

    if (list.length > 0)
    return(
      <div>
        <div class="row row-tall " data-type="stg">  
          <div class="clear">  
            <div class="left"> 
              <img class="flag" alt="flag" src={icon} style={header_icon}/>
              {title}
            </div>   
            <div class="right fs11">[{list.length}]</div>  
          </div>  
        </div>
    
        {list.map((match) => <Match key={match.id} match={match} />)}
      </div>
    )
      return ;
  }

  render(){
    const { matches, liveOnly } = this.props;
    const live = matches[0];
    const next = matches[1];
    const ended = matches[2];

    if (liveOnly)
      return (
        <div>
          {this.showList(live, "LIVE", icon_live) }
          {this.showList(next, "SCHEDULED", icon_next) }
        </div>
        );

    return (
      <div>
        {this.showList(live, "LIVE", icon_live) }
        {this.showList(next, "SCHEDULED", icon_next) }
        {this.showList(ended, "ENDED", icon_ended) }
      </div>
      );
      
  }}

export default KickoffMatches;
