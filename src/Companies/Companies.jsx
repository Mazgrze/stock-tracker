import React from 'react';
import { Media, Row, Col } from 'react-bootstrap';
import upImage from './up.png';
import downImage from './down.png';

export default function Companies({ companies }) {
  const companyList = companies.map(company => (
    <Media as="li" key={company.symbol}>
      <img width={64} height={64} className="mr-3" src={company.logo} alt="" />
      <Media.Body>
        <h5>
          {company.name}
          <span>&nbsp;&nbsp;</span>
          <small>
            <span>&nbsp;&nbsp;</span>
            {`${company.symbol}`}
            <span>&nbsp;&nbsp;</span>
            <a href={company.domain}>{company.domain}</a>
          </small>
        </h5>
        <p>
          {`${company.region} ${company.marketOpen} - ${company.marketClose} ${company.timezone}`}
        </p>
        <p>
          {isNaN(company.price) ? (
            <b className="text-danger">Error</b>
          ) : (
            <>
              <b>{parseFloat(company.price).toFixed(2)}</b>
              <span>&nbsp;</span>
              {company.currency}
              <span>&nbsp;&nbsp;</span>
              <span className={parseFloat(company.change) > 0 ? 'text-success' : 'text-danger'}>
                {` ${parseFloat(company.change).toFixed(2)} (${parseFloat(
                  company.percentChange,
                ).toFixed(2)}) `}
                {parseFloat(company.change) > 0 ? (
                  <img src={upImage} style={{ transform: 'rotate(180deg)' }} alt="" />
                ) : (
                  <img src={downImage} alt="" />
                )}
              </span>
              <span>&nbsp;&nbsp;</span>
              {' Closed: '}
              <span>&nbsp;</span>
              {company.closed}
            </>
          )}
        </p>
      </Media.Body>
    </Media>
  ));

  return (
    <Row>
      <Col xs="auto">
        <h2>Companies:</h2>
        <p />
        <ul>{companyList}</ul>
      </Col>
    </Row>
  );
}
