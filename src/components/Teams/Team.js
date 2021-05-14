import React from 'react';

export const completeTeam = (t, countries)=>{
  const country = countries.find(e => e.id === t.country_id);
  t.country = country || "";
}


class Team extends React.Component {

  render() {
   const { team } = this.props;
    return <div>{team.name}</div>;
  }
}

export default Team;
