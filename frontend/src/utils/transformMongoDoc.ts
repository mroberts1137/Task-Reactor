export type MongoDocument<T> = Omit<T, 'id'> & { _id: string };
export type FrontendDocument<T> = Omit<T, '_id'> & { id: string };

export function transformMongoDocument<T>(
  doc: MongoDocument<T>
): FrontendDocument<T> {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id
  } as FrontendDocument<T>;
}

export function transformToMongoDocument<T>(
  doc: FrontendDocument<T>
): MongoDocument<T> {
  const { id, ...rest } = doc;
  return {
    ...rest,
    _id: id
  } as MongoDocument<T>;
}
