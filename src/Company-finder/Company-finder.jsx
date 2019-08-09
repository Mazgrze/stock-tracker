import axios from 'axios';
import React from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import apiKey from '../utils/api';
import cleanKeys from '../utils/utils';

export default function CompanyFinder({ addCompany, companies, results, updateResults }) {
  let throttle;
  const selected = companies.map(el => el.symbol);

  const input = React.createRef();

  function askApi(keyWord) {
    axios
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURI(
          keyWord,
        )}&apikey=${apiKey}`,
      )
      .then(({ data: { bestMatches } }) => {
        // Clean data keys
        const companyList = bestMatches.map(el => cleanKeys(el));
        updateResults(companyList);
      })
      // eslint-disable-next-line no-console
      .catch(x => console.log(x));
  }

  function debounceRequests(e) {
    e.stopPropagation();
    const val = e.target.value;
    if (val.length) {
      // Debounce input
      clearTimeout(throttle);
      throttle = setTimeout(() => {
        askApi(val);
      }, 500);
    }
  }

  function submitSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    const val = input.value;
    if (val && val.length) {
      askApi(val);
    }
  }
  return (
    <Row>
      <Col xs="auto">
        <h3>Find companies to track</h3>
        <Form onSubmit={submitSearch}>
          <Row>
            <Col sm={8}>
              <Form.Control ref={input} type="text" onChange={debounceRequests} />
            </Col>
            <Col>
              <Button onClick={submitSearch}>Search</Button>
            </Col>
          </Row>
          <p />
        </Form>
        <Row>
          {!!results.length && (
            <Col xs="auto">
              <Table striped bordered hover>
                <tbody>
                  {results.map((el, index) => (
                    <tr key={el.symbol}>
                      <td>{`${index + 1}.`}</td>
                      <td>{el.symbol}</td>
                      <td>{el.name}</td>
                      <td>
                        <Button
                          disabled={selected.includes(el.symbol)}
                          onClick={() => {
                            addCompany(el);
                          }}
                        >
                          add
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}
