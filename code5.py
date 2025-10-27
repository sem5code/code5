import tensorflow as tf, numpy as np, matplotlib.pyplot as plt

(xtr, ytr), (xte, yte) = tf.keras.datasets.mnist.load_data()
xtr, xte = xtr[..., None]/255.0, xte[..., None]/255.0

m = tf.keras.Sequential([
  tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(28,28,1)),
  tf.keras.layers.MaxPool2D(2),
  tf.keras.layers.Conv2D(64, 3, activation='relu'),
  tf.keras.layers.MaxPool2D(2),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.5),
  tf.keras.layers.Dense(10, activation='softmax')
])

m.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['acc'])
h = m.fit(xtr, ytr, epochs=5, validation_data=(xte, yte), verbose=1)
print(f"\n✅ Test Accuracy: {m.evaluate(xte, yte, verbose=0)[1]*100:.2f}%")

plt.figure(figsize=(10,4))
for i, k in enumerate(['acc','loss']):
    plt.subplot(1,2,i+1)
    plt.plot(h.history[k], label='Train')
    plt.plot(h.history[f'val_{k}'], label='Val'); plt.legend(); plt.title(k.capitalize())
plt.show()

i = np.random.randint(len(xte))
p = np.argmax(m.predict(xte[i][None]))
plt.imshow(xte[i].squeeze(), cmap='gray')
plt.title(f"Pred:{p}, True:{yte[i]}"); plt.axis('off'); plt.show()
