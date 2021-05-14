import React from "react"
import { Link } from "gatsby"
import { useQueryParam, NumberParam, StringParam } from "use-query-params";

import Layout from "../components/layout"
import SEO from "../components/seo"

const MatchesDay = () => {
  const [day, setDay] = useQueryParam("day", 0);

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Hi from the {day} page</h1>
      <p>Welcome to page 2</p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default MatchesDay
