<?php if ($origin) : ?>

    <tr>
        <th>Origin:</th>
        <td><?php echo $origin['value']; ?></td>
    </tr>

<?php endif; ?>

<?php if ($destination) : ?>

    <tr>
        <th>Destination:</th>
        <td><?php echo $destination['value']; ?></td>
    </tr>

<?php endif; ?>

<?php if ($delivery_date) : ?>

    <tr>
        <th>Delivery Date:</th>
        <td><?php echo date('l, F j, Y', strtotime($delivery_date)); ?></td>
    </tr>

<?php endif; ?>