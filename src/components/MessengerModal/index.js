import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import api from "../../services/api";

export default function MessengerModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const handleConnect = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/channels/messenger/connect");
      if (data?.authUrl) window.open(data.authUrl, "_blank");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Conectar Messenger</DialogTitle>
      <DialogContent>
        Para conectar Messenger, se abrirá una ventana de Facebook para autorizar la página/cuenta.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button color="primary" variant="contained" onClick={handleConnect} disabled={loading}>
          Autorizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
