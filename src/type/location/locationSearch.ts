export type AddressSearchResult = {
  addressName: string;
  roadAddressName: string | null;
  lotNumberAddressName: string | null;
  longitude: string;
  latitude: string;
};

export type SearchAddressResponse = {
  documents: AddressSearchResult[];
};