<div class="address">

    <?php if ($origin) : ?>

        <div style="background: rgba(255, 0, 0, .65); padding: 10px; border-radius: 3px;">

            <p style="color: #fff;"><strong>Origin:</strong><?php echo $origin['value']; ?></td></p>

        </div>

    <?php endif; ?>

    <?php if ($destination) : ?>

        <p><strong>Destination:</strong><?php echo $destination['value']; ?></td></p>

    <?php endif; ?>

    <?php if ($delivery_date) : ?>

        <p><strong>Delivery Date:</strong><?php echo date('l, F j, Y', strtotime($delivery_date)); ?></td></p>

    <?php endif; ?>

    <?php if ($shipping_method) : ?>

        <p><strong>Shipping Method:</strong><?php echo $shipping_method; ?></td></p>

    <?php endif; ?>

</div>