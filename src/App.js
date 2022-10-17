import { useQuery, gql } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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
        rdfs_label{
          value 
        }
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
  const positionFirstPoi = [data.poi.results[0].isLocatedAt[0].schema_geo[0].schema_latitude[0],data.poi.results[0].isLocatedAt[0].schema_geo[0].schema_longitude[0]];
  return (
  
  <MapContainer center={positionFirstPoi} zoom={13} scrollWheelZoom={true} style={{ height: 800, width: 1200 }}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {data.poi.results.map(({ isLocatedAt,rdfs_label }) => (
     <Marker position={[isLocatedAt[0].schema_geo[0].schema_latitude[0],isLocatedAt[0].schema_geo[0].schema_longitude[0]]}>
      <Popup>
       {rdfs_label[0].value}
      </Popup>
    </Marker>
    ))}

  </MapContainer>
  );
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
      <div>
        <DisplayLocations />
      </div>
    </div>
  );
}
