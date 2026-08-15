import React from "react";

import AssetModal from "./AssetModal";

const AddAssetModal = (props) => {
  return (
    <AssetModal
      {...props}
      title="Add Portfolio Asset"
      description="Track a cryptocurrency in your portfolio."
      submitLabel="Add Asset"
      initialValues={{}}
      onSubmit={props.onAddAsset}
    />
  );
};

export default AddAssetModal;
