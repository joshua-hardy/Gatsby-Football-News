/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Link from "gatsby"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import "../css/layout.css"

import menu_matches from "../images/menu_matches_on.png" 
import menu_favs from "../images/menu_favourites_off.png" 
import menu_comps from "../images/menu_explore_off.png" 
import menu_profile from "../images/menu_profile_off.png" 

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (

      <div
        style={{
          margin: `0 auto`,
          maxWidth: '100%',
          padding: `0`,
        }}
    >

      <main>
        <div class="">
          <div class="wrapper wrapper-tall">
            <div class="nav-footer clear hidden-sm" data-type="menu-m"> 
              <div class="item"><a class="active" href="/"> <img src={menu_matches}/> <span>Matches</span> </a> </div> 
              <div class="item"><a class=""       href="#"> <img src={menu_favs}/>    <span>Favorites</span></a> </div> 
              <div class="item"><a class=""       href="#"> <img src={menu_comps}/>   <span>Competitions</span> </a> </div> 
              <div class="item"><a class=""       href="#"> <img src={menu_profile}/> <span>Profile</span> </a> </div> 
            </div>
            <div class="content-wrap">
              <div class="content">
                  {children}
              </div>
            </div>
            <a href="http://rek.futbol24.com/ck.php?oaparams=2__bannerid=5226__zoneid=687__cb=1586876401__oadest=http%3A%2F%2Fbs.serving-sys.com%2FServing%2FadServer.bs%3Fcn%3Dtrd%26pli%3D1075358271%26adid%3D1080299048%26ord%3D%5Btimestamp%5D">
              <img class="main_banner" id="img" src="http://rek.futbol24.com/images/ef4e490f929f5f724944bee90eb771fd.gif" alt="show"/>
            </a>
          </div>
        </div>
      </main>
  </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
