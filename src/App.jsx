import React, { useState, useEffect } from 'react';
import {
  Row, Container, Navbar, Nav, Col,
} from 'react-bootstrap';
import Axios from 'axios';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import CompanyFinder from './Company-finder/Company-finder';
import Companies from './Companies/Companies';
import apiKey from './utils/api';
import cleanKeys, { cleanCompanyName } from './utils/utils';

const cachedCompanies = JSON.parse(localStorage.getItem('stockTrackerCompanies')) || [];

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
          /* eslint-disable no-param-reassign */
          companiesArray[this.index].change = Math.random() * (30 - 0) + 0;
          companiesArray[this.index].percentChange = Math.random(); // "-0.8240%"
          companiesArray[this.index].price = Math.random() * 100;
          companiesArray[this.index].closed = apiData['latest trading day'];
          /* eslint-enable no-param-reassign */
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

  function addCompany(company) {
    try {
      const newCompany = { ...company };
      const name = cleanCompanyName(company.name);
      // Get logo
      Axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`)
        .then((response) => {
          newCompany.logo = response.data[0].logo || '';
          newCompany.domain = response.data[0].domain || '';
        })
        .then(() => Axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${
            company.symbol
          }&apikey=${apiKey}`,
        ))
        .then((resp) => {
          const quote = cleanKeys(resp.data['Global Quote']);
          newCompany.change = quote.change;
          newCompany.percentChange = quote['change percent'];
          newCompany.price = quote.price;
          newCompany.closed = quote['latest trading day'];
        })
        // eslint-disable-next-line no-console
        .catch(e => console.log(e))
        .finally(() => {
          const newCompanies = [...companies, newCompany];
          localStorage.setItem('stockTrackerCompanies', JSON.stringify(newCompanies));
          setCompanies(newCompanies);
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e.message);
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
