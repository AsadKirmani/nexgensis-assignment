import { Product } from "@/services/products.service";

const STORAGE_KEY = "product-admin-changes";
const LOCAL_PRODUCT_START_ID = 195;

interface ProductChanges {
  added: Product[];
  updated: Record<number, Product>;
  deleted: number[];
}

const getEmptyChanges = (): ProductChanges => ({
  added: [],
  updated: {},
  deleted: [],
});

const getChanges = (): ProductChanges => {
  if (typeof window === "undefined") {
    return getEmptyChanges();
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return getEmptyChanges();
  }

  try {
    return JSON.parse(stored);
  } catch {
    return getEmptyChanges();
  }
};

const saveChanges = (changes: ProductChanges) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
};

export const saveAddedProduct = (product: Product): Product => {
  const changes = getChanges();

  const highestLocalId = changes.added.reduce(
    (maxId, item) => Math.max(maxId, item.id),
    LOCAL_PRODUCT_START_ID - 1,
  );

  const localProduct: Product = {
    ...product,
    id: highestLocalId + 1,
    images: product.images ?? [],
    thumbnail: product.thumbnail ?? "",
    reviews: product.reviews ?? [],
  };

  changes.added.push(localProduct);

  saveChanges(changes);

  return localProduct;
};

export const saveUpdatedProduct = (product: Product) => {
  const changes = getChanges();

  const isLocalProduct = changes.added.some(
    (item) => item.id === product.id,
  );

  if (isLocalProduct) {
    changes.added = changes.added.map((item) =>
      item.id === product.id ? product : item,
    );
  } else {
    changes.updated[product.id] = product;
  }

  saveChanges(changes);
};

export const saveDeletedProduct = (id: number) => {
  const changes = getChanges();

  const isLocalProduct = changes.added.some(
    (product) => product.id === id,
  );

  if (isLocalProduct) {
    changes.added = changes.added.filter(
      (product) => product.id !== id,
    );
  } else {
    delete changes.updated[id];

    if (!changes.deleted.includes(id)) {
      changes.deleted.push(id);
    }
  }

  saveChanges(changes);
};

export const getLocalProductChanges = (): ProductChanges => {
  return getChanges();
};