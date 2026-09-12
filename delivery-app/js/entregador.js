(() => {
  const accept = document.getElementById("acceptOrder");
  const start = document.getElementById("startDelivery");
  const finish = document.getElementById("finishDelivery");

  if (accept) accept.addEventListener("click", () => {
    accept.disabled = true;
    accept.textContent = "✓ Pedido aceito";
    alert("Pedido aceito! 🟢");
  });

  if (start) start.addEventListener("click", () => {
    start.textContent = "🚚 Entrega em andamento";
    alert("Entrega iniciada! 🚚");
  });

  if (finish) finish.addEventListener("click", () => {
    finish.disabled = true;
    finish.textContent = "✓ Entrega concluída";
    alert("Entrega finalizada com sucesso! ✅");
  });
})();