import React from "react";

import AssetModal from "./AssetModal";

const EditAssetModal = ({ asset, onUpdateAsset, ...props }) => {
  return (
    <AssetModal
      {...props}
      title="Edit Portfolio Asset"
      description="Update your investment details."
      submitLabel="Save Changes"
      initialValues={{
        coinId: asset?.coin_id,
        quantity: asset?.quantity,
        buyPrice: asset?.buy_price,
        buyDate: asset?.buy_date?.split("T")[0],
      }}
      onSubmit={(values) =>
        onUpdateAsset({
          assetId: asset.id,
          ...values,
        })
      }
    />
  );
};

export default EditAssetModal;
