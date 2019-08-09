import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import Companies from './Companies/Companies';
import CompanyFinder from './Company-finder/Company-finder';
import apiKey from './utils/api';
import cleanKeys, { cleanCompanyName } from './utils/utils';

function App() {
  const [companies, setCompanies] = useState(cachedCompanies);
  const [searchResults, setSearchResults] = useState([]);

  function companyFactory(companyIndex, companiesArray) {
    return {
      index: companyIndex,
      symbol: companiesArray[companyIndex].symbol,
      getData() {
        return Axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${
            // eslint-disable-next-line react/no-this-in-sfc
            this.symbol
          }&apikey=${apiKey}`,
        ).then((response) => {
          const apiData = cleanKeys(response.data['Global Quote']);
          // eslint-disable-next-line no-param-reassign
          companiesArray[this.index] = { ...companiesArray[this.index], ...apiData };
          setCompanies(companiesArray);
        });
      },
    };
  }

  async function updateStock() {
    // deep copy
    const updatedCompanies = companies.map(obj => ({ ...obj }));
    let requests = updatedCompanies.map((v, i) => companyFactory(i, updatedCompanies));
    requests = requests.map(obj => obj.getData());
    Promise.all(requests).then(() => {
      // save updated data
      localStorage.setItem('stockTrackerCompanies', JSON.stringify(updatedCompanies));
    });
  }

  useEffect(() => {
    updateStock();
  }, []);

  async function addCompany(company) {
    try {
      let newCompany = { ...company };
      const name = cleanCompanyName(company.name);
      // Get logo
      const {
        data: [searchResult],
      } = await Axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`);
      const { data: secondData } = await Axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${
          company.symbol
        }&apikey=${apiKey}`,
      );
      const quote = cleanKeys(secondData['Global Quote']);
      newCompany = { ...newCompany, ...searchResult, ...quote };

      const newCompanies = [...companies, newCompany];
      setCompanies(newCompanies);
      localStorage.setItem('stockTrackerCompanies', JSON.stringify(newCompanies));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  function clearResults() {
    setSearchResults([]);
  }

  return (
    <Router>
      <Navbar bg="light" expand="sm">
        <Navbar.Brand href="#home">Stock tracker</Navbar.Brand>
        <Nav className="mr-auto" onClick={clearResults}>
          <Link className="btn" to="/">
            Home
          </Link>
          <Link className="btn" to="/find">
            Find Companies
          </Link>
          <Link className="btn" to="/companies">
            Companies
          </Link>
        </Nav>
      </Navbar>
      <Container>
        <Route
          path="/"
          exact
          component={() => (
            <Row>
              <Col sm="auto">
                <h2>Welcome on our Stock tracker</h2>
                {companies.length ? (
                  <p>
                    <Link to="/companies">Track your companies</Link>
                  </p>
                ) : (
                  <p>
                    There are no companies yet.
                    <Link to="/find"> Track your first company.</Link>
                  </p>
                )}
              </Col>
            </Row>
          )}
        />
        <Route path="/companies" component={() => <Companies companies={companies} />} />
        <Route
          path="/find"
          component={() => (
            <CompanyFinder
              addCompany={addCompany}
              companies={companies}
              results={searchResults}
              updateResults={setSearchResults}
            />
          )}
        />
      </Container>
    </Router>
  );
}

export default App;
