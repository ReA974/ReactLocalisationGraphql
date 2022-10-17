import { useQuery, gql } from '@apollo/client';

const GET_LOCATIONS = gql`	
{
  poi(
    filters: [{
      isLocatedAt: {
        schema_address: {
          schema_addressLocality: {
            _eq: "La Rochelle"
          }
        }
      }
    }
    ]) {
    total results {
        isLocatedAt{
        schema_geo{
          schema_latitude
          schema_longitude
        }
      }
    }
  }
}
`;

function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return data.poi.results.map(({ isLocatedAt }) => (
    <div>
      <p>
        {isLocatedAt[0].schema_geo[0].schema_latitude}
        {isLocatedAt[0].schema_geo[0].schema_longitude}
      </p>
    </div>
  ));
  
}

export default function App() {
  return (
    <div>
      <h2>
        GéoLocalisation POI
        <span role="img">
          🗺️
        </span>
      </h2>
      <br />
      <DisplayLocations />
    </div>
  );
}
